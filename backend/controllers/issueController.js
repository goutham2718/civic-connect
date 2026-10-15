import Issue from '../models/IssueModel.js';
import Vote from '../models/voteModel.js';
import StatusUpdate from '../models/statusUpdateModel.js';
import localBodyModel from '../models/LocalbodyModel.js';
import cloudinary from '../config/cloudinary.js';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const palakkadGeoJSON = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../geojson/palakkad.geojson'),
    'utf-8'
  )
);

const VALID_STATUSES = ['reported', 'acknowledged', 'in-progress', 'resolved'];

// POST /api/issues
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, localbody, address, lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates are required'
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    const userPoint = point([longitude, latitude]);

    const isInsidePalakkad = booleanPointInPolygon(
      userPoint,
      palakkadGeoJSON.features[0]
    );

    if (!isInsidePalakkad) {
      return res.status(400).json({
        success: false,
        message: 'Selected location must be within Palakkad district'
      });
    }

    const issueData = {
      title,
      description,
      category,
      localbody,
      location: {
        address: address || '',
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      },
      createdBy: req.user._id
    };

    if (category === 'pothole' && req.body.roadType) {
      issueData.roadType = req.body.roadType;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      issueData.photoUrl = result.secure_url;
      issueData.photoPublicId = result.public_id;
    }

    const issue = await Issue.create(issueData);

    await StatusUpdate.create({
      issueId: issue._id,
      status: 'reported',
      note: 'Issue reported',
      updatedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Issue created successfully'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create issue'
    });
  }
};

// GET /api/issues (public board — no department scoping)
export const getIssues = async (req, res) => {
  try {
    const { category, localbody, status, sort = 'recent' } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (localbody) filter.localbody = localbody;
    if (status) filter.status = status;

    const sortOption =
      sort === 'upvotes'
        ? { upvoteCount: -1}
        : { createdAt: -1 };

    const issues = await Issue.find(filter)
      .sort(sortOption)
      .populate('createdBy', 'name')
      .populate('localbody', 'name type');;

    res.json({
      success: true,
      data: issues
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch issues'
    });
  }
};

// GET /api/issues/admin — scoped to the logged-in admin's department(s)
export const getAdminIssues = async (req, res) => {
  try {
    const { status, sort = 'recent' } = req.query;
    const filter = {};

    if (req.user.role === 'dept_admin') {
      const { authorityType, department, localBody } = req.user;

      if (authorityType === 'lsgi') {
        filter.localbody = localBody;
        filter.category = { $in: department };
        // Exclude PWD-owned potholes from LSGI's queue
        filter.$or = [
          { category: { $ne: 'pothole' } },
          { category: 'pothole', roadType: 'local' }
        ];
      } else if (authorityType === 'pwd') {
        filter.category = 'pothole';
        filter.roadType = 'pwd';
      } else if (authorityType === 'kwa') {
        filter.category = { $in: department };
      }
    }
    // super_admin gets no filter — sees everything

    if (status) filter.status = status;

    const sortOption = sort === 'upvotes'
      ? { upvoteCount: -1}
      : { createdAt: -1 };

    const issues = await Issue.find(filter)
      .sort(sortOption)
      .populate('createdBy', 'name email')
      .populate('localbody', 'name type');

    res.json({ success: true, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin issues'});
  }
};

// PATCH /api/issues/:id/status — requires requireDepartmentAccess middleware to have run first
export const updateIssueStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const issue = req.issue; // attached by requireDepartmentAccess middleware
    issue.status = status;
    await issue.save();

    await StatusUpdate.create({
      issueId: issue._id,
      status,
      note: note || '',
      updatedBy: req.user._id
    });

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: issue
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
};

// GET /api/issues/:id
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('localbody', 'name type');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const history = await StatusUpdate.find({
      issueId: issue._id
    })
      .sort({ createdAt: 1 })
      .populate('updatedBy', 'name role');

    res.json({
      success: true,
      data: {
        issue,
        history
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch issue'
    });
  }
};

export const getIssuesByUserId = async (req, res) => {
  try {

    const issues = await Issue.find({
      createdBy: req.user._id
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('localbody', 'name type');

    if (issues.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No issues found'
      })
    }

    res.status(200).json({
      success: true,
      data: issues
    })

  } catch (err) {

    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues'
    })

  }
}

// PATCH /api/issues/:id/reassign-road-type
// Access already validated by requireDepartmentAccess before this runs
export const reassignRoadType = async (req, res) => {
  try {
    const issue = req.issue; // attached by requireDepartmentAccess

    if (issue.category !== 'pothole') {
      return res.status(400).json({
        success: false,
        message: 'Road type reassignment only applies to pothole issues'
      });
    }

    // Only lsgi/pwd admins (or super_admin) can reassign — not kwa
    if (req.user.role === 'dept_admin' && !['lsgi', 'pwd'].includes(req.user.authorityType)) {
      return res.status(403).json({
        success: false,
        message: 'Only LSGI or PWD admins can reassign road type'
      });
    }

    const previousRoadType = issue.roadType;
    const newRoadType = previousRoadType === 'local' ? 'pwd' : 'local';

    issue.roadType = newRoadType;
    await issue.save();

    const { note } = req.body;

    await StatusUpdate.create({
      issueId: issue._id,
      status: issue.status, // status itself doesn't change, just the routing
      note: note
        ? `Reassigned from ${previousRoadType === 'local' ? 'LSGI' : 'PWD'} to ${newRoadType === 'local' ? 'LSGI' : 'PWD'}: ${note}`
        : `Reassigned from ${previousRoadType === 'local' ? 'LSGI' : 'PWD'} to ${newRoadType === 'local' ? 'LSGI' : 'PWD'}`,
      updatedBy: req.user._id
    });

    res.json({
      success: true,
      message: `Issue reassigned to ${newRoadType === 'local' ? 'LSGI' : 'PWD'}`,
      data: issue
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to reassign road type'
    });
  }
};


// Helper function: Calculate distance in meters between two lat/lng points using Haversine formula
const getHaversineDistanceMeters = (lat1, lng1, lat2, lng2) => {
  const EARTH_RADIUS_METERS = 6371000

  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)

  const lat1Rad = lat1 * (Math.PI / 180)
  const lat2Rad = lat2 * (Math.PI / 180)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_METERS * c
}

// POST /api/issues/check-nearby
// Checks for existing open issues of the same category within a radius (meters)
export const checkNearbyIssues = async (req, res) => {
  try {
    const { category, lat, lng, radius = 200 } = req.body

    if (!category || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Category and coordinates are required'
      })
    }

    const userLat = Number(lat)
    const userLng = Number(lng)
    const maxRadius = Number(radius)

    // 1. Fetch matching active issues in the same category
    const issues = await Issue.find({
      category,
      status: { $ne: 'resolved' }
    })
      .select('title photoUrl status upvoteCount location createdAt')
      .lean()

    // 2. Filter issues within radius and compute distance in JS
    const nearbyIssues = issues
      .map((issue) => {
        const issueLat = issue.location?.coordinates?.lat
        const issueLng = issue.location?.coordinates?.lng

        if (issueLat === undefined || issueLng === undefined) return null

        const distanceMeters = getHaversineDistanceMeters(
          userLat,
          userLng,
          issueLat,
          issueLng
        )

        return {
          _id: issue._id,
          title: issue.title,
          photoUrl: issue.photoUrl,
          status: issue.status,
          upvoteCount: issue.upvoteCount,
          distanceMeters: Math.round(distanceMeters),
          createdAt: issue.createdAt
        }
      })
      .filter((issue) => issue !== null && issue.distanceMeters <= maxRadius)
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, 5) // Return top 5 closest issues

    res.json({
      success: true,
      data: nearbyIssues
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to check nearby issues'
    })
  }
}

// DELETE /api/issues
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.body.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const isOwner =
      issue.createdBy.toString() === req.user._id.toString();

    // Fixed: 'admin' never existed in the role enum — now checks real roles.
    // Also scopes dept_admin deletion to their own department, same as status updates.
    const isSuperAdmin = req.user.role === 'super_admin';
    const isDeptAdminInScope =
      req.user.role === 'dept_admin' && req.user.department.includes(issue.category);

    if (!isOwner && !isSuperAdmin && !isDeptAdminInScope) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this issue'
      });
    }

    if (issue.photoPublicId) {
      await cloudinary.uploader.destroy(issue.photoPublicId);
    }

    await Vote.deleteMany({
      issueId: issue._id
    });

    await StatusUpdate.deleteMany({
      issueId: issue._id
    });

    await issue.deleteOne();

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete issue'
    });
  }
};