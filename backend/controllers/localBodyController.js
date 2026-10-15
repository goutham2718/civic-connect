import localBodyModel from "../models/LocalbodyModel.js";

// GET /api/local-bodies?type=&block=
export const getLocalBodies = async (req, res) => {
  try {
    const { type, block } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (block) filter.block = block;

    const localBodies = await localBodyModel.find(filter);
    res.json(
        {success: true,
        data: localBodies});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch local bodies'});
  }
};

// POST /api/local-bodies (admin only, for adding missing entries later)
export const createLocalBody = async (req, res) => {
  try {
    const { name, type, block } = req.body;
    if (!name || !type) {
      return res.status(400).json({
        success:false,
        message: 'Name and type are required'
      });
    }
    const exist = localBodyModel.findOne({name, type});
    if(exist){
        return res.json({
            success:false,
            message: 'Local body already exist'});
    }
    await localBodyModel.create({ name, type, block });
    res.json({
        success:true,
        message:'Local body created successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create local body'});
  }
};