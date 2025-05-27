const Cash_Register_Status = require("../models/Cash_Register_Status");
const monthlyScholarshipDetailsSchema = require("../models/Monthly_scholarship_details");
const StudentScholarship = require("../models/Student_Scholarship");
const Contribution = require("../models/Contribution");
const User = require("../models/User");

// const addStudentScholarshipOnceAMonthAndUpdateCRS = async (req, res) => {
    const addStudentScholarshipOnceAMonthAndUpdateCRS = async () => {

   // try {
        const students = await User.find({ role: "Student" }).lean();
        if (!students?.length) return res.json([]);

        // // חישוב תחילת וסוף החודש הקודם
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1); // החודש הקודם
        startOfMonth.setDate(1); // היום הראשון של החודש הקודם

        const endOfMonth = new Date();
        endOfMonth.setDate(0); // היום האחרון של החודש הקודם
        //check
        // const startOfMonth = new Date();
        // startOfMonth.setDate(1); // היום הראשון של החודש

        // const endOfMonth = new Date();
        // endOfMonth.setMonth(endOfMonth.getMonth() + 1); // היום הראשון של החודש הבא
        // endOfMonth.setDate(0); // היום האחרון של החודש הנוכחי

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
                totalExpenses += scholarshipAmount; // Add to total expenses
            }
        }

        // Update the Cash Register Status with the total expenses
        const lastCashRegisterStatus = await Cash_Register_Status.findOne().sort({ date: -1 }).lean();
        const currentSum = lastCashRegisterStatus ? lastCashRegisterStatus.currentSum : 0;

        const newCashRegisterStatus = await Cash_Register_Status.create({
            action: "Expense",
            sumPerAction: totalExpenses,
            date: new Date(),
            currentSum: currentSum - totalExpenses, // Update the current sum
        });

        // res.json({
        //     message: "Monthly scholarships processed and expenses updated.",
        //     newCashRegisterStatus,
        // });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send("An error occurred while processing scholarships.");
    // }
};

//const addMonthlyContributionsToCRS = async (req, res) => {
const addMonthlyContributionsToCRS = async () => {
    //try {
        // // חישוב תחילת וסוף החודש הקודם
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1); // החודש הקודם
        startOfMonth.setDate(1); // היום הראשון של החודש הקודם

        const endOfMonth = new Date();
        endOfMonth.setDate(0); // היום האחרון של החודש הקודם
        //check
        // const startOfMonth = new Date();
        // startOfMonth.setDate(1); // היום הראשון של החודש
        // console.log("Start of Month:", startOfMonth);

        // const endOfMonth = new Date();
        // endOfMonth.setMonth(endOfMonth.getMonth() + 1); // היום הראשון של החודש הבא
        // endOfMonth.setDate(0); // היום האחרון של החודש הנוכחי
        // console.log("End of Month:", endOfMonth);
        // שליפת סך התרומות עבור החודש הנוכחי
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

        // אם אין תרומות, החזר הודעה מתאימה
        if (totalIncome === 0) {
            return res.send("No donations found for this month.");
        }

        // שליפת הסכום הנוכחי האחרון מ-CRS
        const lastCashRegisterStatus = await Cash_Register_Status.findOne().sort({ date: -1 }).lean();
        const currentSum = lastCashRegisterStatus ? lastCashRegisterStatus.currentSum : 0;

        // הוספת רשומה חדשה ל-CRS
        const newCashRegisterStatus = await Cash_Register_Status.create({
            action: "Income",
            sumPerAction: totalIncome,
            date: new Date(),
            currentSum: currentSum + totalIncome,
        });

        // res.json({
        //     message: "Monthly donations processed and income added to CRS.",
        //     newCashRegisterStatus,
        // });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send("An error occurred while processing donations.");
    // }
};


module.exports = { addStudentScholarshipOnceAMonthAndUpdateCRS, addMonthlyContributionsToCRS };