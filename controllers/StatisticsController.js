// - Tạo 1 phiên kiểm tra (kiểm tra lại duration với startTime )
const Exam = require("../models/Exam")
const mongoose = require("mongoose");
const Course = require("../models/Course")
const User = require("../models/User")
const TakeExam = require("../models/TakeExam");
const { STATUS, VIEWPOINT } = require("../utils/enum");
const moment = require("moment/moment");
const ExamResult = require("../models/ExamResult");

const StatisticController = {
    getTakeExamByStudent: async (takeExam) => {
        const username = req.user.sub
        const {examSlug} = req.body

        const user = await User.findOne({username})
        if(!user) return res.status(200).json({message:"Không có tài khoản"})
        
        const exam = await Exam.findOne({slug:examSlug})
        if(!exam) return res.status(200).json({message:"Không tìm thấy khoá học"}) 
        let takeExams = await TakeExam.find({user:user.id,exam:exam.id})

        let results = takeExams.map(item=>({
            ...item._doc,
            maxPoints:exam.maxPoints
        }))
        return res.status(200).json(results)
    },
    getTakeExamByTeacher: async (req,res) => {
        const username = req.user.sub
        const {examSlug} = req.query

        const user = await User.findOne({username})
        if(!user) return res.status(200).json({message:"Không có tài khoản"})
        
        const exam = await Exam.findOne({slug:examSlug})
        if(!exam) return res.status(200).json({message:"Không tìm thấy khoá học"}) 

        if(exam.creatorId.toString() !== user.id.toString()){//nếu không phải người tạo khoá học thì không trả về kết quả
            return res.status(403).json({message:"Không có quyền truy cập"})
        }
        let takeExams = await TakeExam.find({exam:exam.id})

        let results = takeExams.map(item=>({
            ...item._doc,
            maxPoints:exam.maxPoints
        }))
        return res.status(200).json(results)
    },
    
}

module.exports = { StatisticController }