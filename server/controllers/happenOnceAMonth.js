const Cash_Register_Status = require("../models/Cash_Register_Status");
const monthlyScholarshipDetailsSchema = require("../models/Monthly_scholarship_details");
const StudentScholarship = require("../models/Student_Scholarship");
const Contribution = require("../models/Contribution");
const User = require("../models/User");

    const addStudentScholarshipOnceAMonthAndUpdateCRS = async () => {

        const students = await User.find({ role: "Student" }).lean();
        if (!students?.length) return res.json([]);

        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1);
        startOfMonth.setDate(1); 

        const endOfMonth = new Date();
        endOfMonth.setDate(0); 
        

        const moneyForHour = await monthlyScholarshipDetailsSchema
            .findOne({
                date: {
                    $gte: startOfMonth,
                    $lt: endOfMonth,
                },
            })
            .lean()
            .then((doc) => doc?.sumPerHour);

        if (!moneyForHour) return res.status(404).send("No money found");

        let totalExpenses = 0;

        for (const student of students) {
            const studentScholarship = await StudentScholarship.findOne({
                student: student._id,
                date: {
                    $gte: startOfMonth,
                    $lt: endOfMonth,
                },
            }).exec();

            if (studentScholarship && studentScholarship.numHours) {
                const scholarshipAmount = moneyForHour * studentScholarship.numHours;
                studentScholarship.sumMoney = scholarshipAmount;
                await studentScholarship.save();
                totalExpenses += scholarshipAmount; 
            }
        }

        const lastCashRegisterStatus = await Cash_Register_Status.findOne().sort({ date: -1 }).lean();
        const currentSum = lastCashRegisterStatus ? lastCashRegisterStatus.currentSum : 0;

        const newCashRegisterStatus = await Cash_Register_Status.create({
            action: "Expense",
            sumPerAction: totalExpenses,
            date: new Date(),
            currentSum: currentSum - totalExpenses, 
        });

      
};

const addMonthlyContributionsToCRS = async () => {
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1); 
        startOfMonth.setDate(1); 

        const endOfMonth = new Date();
        endOfMonth.setDate(0); 
        
        const totalDonations = await Contribution.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$sumContribution" }, // חישוב סך התרומות
                },
            },
        ]);

        const totalIncome = totalDonations[0]?.totalAmount || 0;

        if (totalIncome === 0) {
            return res.send("No donations found for this month.");
        }

        const lastCashRegisterStatus = await Cash_Register_Status.findOne().sort({ date: -1 }).lean();
        const currentSum = lastCashRegisterStatus ? lastCashRegisterStatus.currentSum : 0;

        const  newCashRegisterStatus = await Cash_Register_Status.create({
            action: "Income",
            sumPerAction: totalIncome,
            date: new Date(),
            currentSum: currentSum + totalIncome,
        });

        
};


module.exports = { addStudentScholarshipOnceAMonthAndUpdateCRS, addMonthlyContributionsToCRS };