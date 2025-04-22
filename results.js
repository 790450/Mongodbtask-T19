//Results for the given queries

//1.Find all the topics and tasks which are thought in the month of October

//result

db.topics.find({
    date : {
        $gte : 15-10-2020,
        $lte : 25-10-2020
    }
})

db.tasks.find({
    dtae : {
        $gte:15-10-2020,
        $lte : 25-10-2020
    }
})


//2.Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

//result

db.company_drivers.find({
    date:{
        $gte:15-10-2020,
        $lte:25-10-2020
    }
})

//3.Find all the company drives and students who are appeared for the placement.

//result

db.company_drives.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "student_id",
        foreignField: "_id",
        as: "user"
      }
    }
])

4//.Find the number of problems solved by the user in codekata

//Results

db.codekata.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info"
      }
    },
    {
      $unwind: "$user_info"
    },
    {
      $project: {
        _id: 0,
        user: "$user_info.name",
        problems_solved: 1
      }
    }
  ])

  //5.Find all the mentors with who has the mentee's count more than 15

  //results

  db.users.aggregate([
    {
      $group: {
        _id: "$mentor_id",
        mentee_count: { $sum: 1 }
      }
    },
    {
      $match: {
        mentee_count: { $gt: 15 }
      }
    },
    {
      $lookup: {
        from: "mentors",
        localField: "_id",
        foreignField: "_id",
        as: "mentor_info"
      }
    },
    {
      $unwind: "$mentor_info"
    },
    {
      $project: {
        _id: 0,
        mentor_name: "$mentor_info.name",
        mentee_count: 1
      }
    }
  ])

  //6.Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

//result 

db.attendance.aggregate([
    {
      $match: {
        date: { $gte: "2020-10-15", $lte: "2020-10-31" },
        present: false
      }
    },
    {
      $lookup: {
        from: "tasks",
        let: { uid: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user_id", "$$uid"] },
                  { $eq: ["$submitted", false] },
                  { $gte: ["$date", "2020-10-15"] },
                  { $lte: ["$date", "2020-10-31"] }
                ]
              }
            }
          }
        ],
        as: "unsubmitted_tasks"
      }
    },
    {
      $match: {
        "unsubmitted_tasks.0": { $exists: true }
      }
    },
    {
      $count: "absent_and_task_not_submitted"
    }
  ])

  //thus all the queries has been done sucessfully
