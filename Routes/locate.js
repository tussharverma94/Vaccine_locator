const task = require("../config_files/download_data")

const route = require("express").Router()

route.get("/", (req, res) =>{
    res.render("home.hbs")
})

route.post("/", (req, res) =>{
    let state = req.body.state.trim()
    let district = req.body.district.trim()
    let user_age = req.body.age
    
    let final_date = req.body.date
    date_arr = final_date.toString().split('-')
    let user_date = date_arr[2] + "-" + date_arr[1] + "-" + date_arr[0]
    
    // console.log(state)
    // console.log(district)
    // console.log(user_date)
    // console.log(user_age)
    // const data_check = task("Uttar Pradesh", "Lucknow", "14-05-2021", 45)
    
    if(state.length == 0 || district.length == 0 || user_age.length == 0 || final_date.length == 0){
        return res.render("home.hbs", {
            Reply : "WRONG INPUT"
        })
    }
    
    const data_check = task(state, district, user_date, user_age)
    data_check.then( (result) => {
        // console.log(result)
        if( result.length === 0){
            res.render("home.hbs",{
                Reply : `NO Data Found for ${user_date} in ${district} for age ${user_age}`
            })
        }else{
            res.render("home.hbs",{
                Reply : `Found Data for 
                age: ${user_age} 
                date : ${user_date} 
                district : ${district}
                state: ${state}`,
                hospital_data : result
            })
        }
    })
    .catch((err) => {
            res.render("home.hbs",{
                Reply : "Typed Name is wrong"
            })
        })
})

route.post('/adult', (req, res) => {
    
    let arr = [
        req.body.value1,
        req.body.value2,
        req.body.value3,
        req.body.value4,
        req.body.value5,
        req.body.value6
    ]
    
    let date_choose
    for(val of arr){
        if(typeof val != "undefined"){
            date_choose = val
        }
    } 
    // console.log(date_choose)

    temp_day = new Date()
    temp_date = parseInt(temp_day.getDate()) + parseInt(date_choose) - 1// as the month in js starts with 0 so no need to add +1 in users value
    user_date = (temp_date).toString() + '-' + (temp_day.getMonth() + 1).toString() + '-' + temp_day.getFullYear().toString()
    // console.log("user_date " + user_date)
    

    // console.log("We are in Adult")
    const data_check = task("Uttar Pradesh", "Lucknow", user_date, 18)
    data_check.then( (result) => {
        // console.log(result)
        if( result.length === 0){
            res.render("home.hbs",{
                Reply : `NO Data Found for ${user_date} in Lucknow for age 18`
            })
        }else{
            res.render("home.hbs",{
                Reply : `Found Data for 
                age: 18 
                date : ${user_date}
                district : Lucknow
                state: Uttar Pradesh`,
                hospital_data : result
            })
        }
    })
})

route.post('/experienced', (req, res) => {
    let arr = [
        req.body.value1,
        req.body.value2,
        req.body.value3,
        req.body.value4,
        req.body.value5,
        req.body.value6
    ]
    
    let date_choose
    for(val of arr){
        if(typeof val != "undefined"){
            date_choose = val
        }
    } 
    // console.log(date_choose)

    temp_day = new Date()
    temp_date = parseInt(temp_day.getDate()) + parseInt(date_choose) - 1// as the month in js starts with 0 so no need to add +1 in users value
    user_date = (temp_date).toString() + '-' + (temp_day.getMonth() + 1).toString() + '-' + temp_day.getFullYear().toString()
    // console.log("user_date " + user_date)

    const data_check = task("Uttar Pradesh", "Lucknow", user_date, 45)
    data_check.then( (result) => {
        // console.log(result)
        if( result.length === 0){
            res.render("home.hbs",{
                Reply : `NO Data Found for ${user_date} in Lucknow for age 45`
            })    
        }else{
            res.render("home.hbs",{
                Reply : `Found Data for \n
                age: 45+\n
                date : ${user_date}\n 
                district : Lucknow\n
                state: Uttar Pradesh`,
                hospital_data : result
            })
        }
    })
})

module.exports = route;