import issueModel from "../models/IssueModel.js";
import voteModel from "../models/voteModel.js";


export const upVote = async (req,res)=>{
    try {
        const {issueId} = req.body;
        await voteModel.create({
            issueId:issueId,
            userId:req.user._id
        })
        const issue = await issueModel.findByIdAndUpdate(issueId,{$inc: {upvoteCount: 1}},{returnDocument: "after"})
        res.json({
            success:true,
            message:'Issue upvoted successfully',
            upvoteCount: issue.upvoteCount
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Failed to upvote"
        })
    }
}

export const getVotes = async(req,res)=>{
    try {
        const votedIssues = await voteModel.find({userId:req.user._id})
        const issueIds = votedIssues.map((vote)=>(vote.issueId.toString()))
        res.json({
            success:true,
            data: issueIds
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch votes'
        });
  }
}

export const removeUpvote = async (req,res)=>{
    try{
        const {issueId} = req.body;
        const vote = await voteModel.findOneAndDelete({issueId:issueId,userId:req.user._id})
        if(!vote){
            return res.json({
                success: false,
                message: 'Vote not found'
            })
        }
        const issue = await issueModel.findByIdAndUpdate(issueId,{$inc: {upvoteCount: -1}},{returnDocument: "after"})
        res.json({
            success:true,
            message:"Upvote removed successfully",
            upvoteCount: issue.upvoteCount
        });
    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Failed to remove upvote"
        })
        
    }
}