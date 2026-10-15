import Issue from '../models/IssueModel.js';

export const requireDepartmentAccess = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (req.user.role === 'super_admin') {
      req.issue = issue;
      return next();
    }

    if (req.user.role !== 'dept_admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { authorityType, department, localBody } = req.user;
    let hasAccess = false;

    if (authorityType === 'lsgi') {
      const sameLocalBody = issue.localbody?.toString() === localBody?.toString();
      const categoryMatch = department.includes(issue.category);
      // If it's a pothole, LSGI only handles it if it's a LOCAL road, not a PWD road
      const roadOk = issue.category !== 'pothole' || issue.roadType === 'local';
      hasAccess = sameLocalBody && categoryMatch && roadOk;

    } else if (authorityType === 'pwd') {
      // PWD is district-wide, only cares about pothole issues on PWD-maintained roads
      hasAccess = issue.category === 'pothole' && issue.roadType === 'pwd';

    } else if (authorityType === 'kwa') {
      // KWA is district-wide, scoped purely by category (e.g. 'water')
      hasAccess = department.includes(issue.category);
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this issue's department"
      });
    }

    req.issue = issue;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Authorization check failed', error: err.message });
  }
};