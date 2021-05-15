const request = require('request')

const states = [
    {
        "state_id":1,
        "state_name":"Andaman and Nicobar Islands"
    },
    {
        "state_id":2,
        "state_name":"Andhra Pradesh"
    },
    {
        "state_id":3,
        "state_name":"Arunachal Pradesh"
    },
    {
        "state_id":4,
        "state_name":"Assam"
    },
    {
        "state_id":5,
        "state_name":"Bihar"
    },
    {
        "state_id":6,
        "state_name":"Chandigarh"
    },
    {
        "state_id":7,
        "state_name":"Chhattisgarh"
    },
    {
        "state_id":8,
        "state_name":"Dadra and Nagar Haveli"
    },
    {
        "state_id":37,
        "state_name":"Daman and Diu"
    },
    {
        "state_id":9,
        "state_name":"Delhi"
    },
    {
        "state_id":10,
        "state_name":"Goa"
    },
    {
        "state_id":11,
        "state_name":"Gujarat"
    },
    {
        "state_id":12,
        "state_name":"Haryana"
    },
    {
        "state_id":13,
        "state_name":"Himachal Pradesh"
    },
    {
        "state_id":14,
        "state_name":"Jammu and Kashmir"
    },
    {
        "state_id":15,
        "state_name":"Jharkhand"
    },
    {
        "state_id":16,
        "state_name":"Karnataka"
    },
    {
        "state_id":17,
        "state_name":"Kerala"
    },
    {
        "state_id":18,
        "state_name":"Ladakh"
    },
    {
        "state_id":19,
        "state_name":"Lakshadweep"
    },
    {
        "state_id":20,
        "state_name":"Madhya Pradesh"
    },
    {
        "state_id":21,
        "state_name":"Maharashtra"
    },
    {
        "state_id":22,
        "state_name":"Manipur"
    },
    {
        "state_id":23,
        "state_name":"Meghalaya"
    },
    {
        "state_id":24,
        "state_name":"Mizoram"
    },
    {
        "state_id":25,
        "state_name":"Nagaland"
    },
    {
        "state_id":26,
        "state_name":"Odisha"
    },
    {
        "state_id":27,
        "state_name":"Puducherry"
    },
    {
        "state_id":28,
        "state_name":"Punjab"
    },
    {
        "state_id":29,
        "state_name":"Rajasthan"
    },
    {
        "state_id":30,
        "state_name":"Sikkim"
    },
    {
        "state_id":31,
        "state_name":"Tamil Nadu"
    },
    {
        "state_id":32,
        "state_name":"Telangana"
    },
    {
        "state_id":33,
        "state_name":"Tripura"
    },
    {
        "state_id":34,
        "state_name":"Uttar Pradesh"
    },
    {
        "state_id":35,
        "state_name":"Uttarakhand"
    },
    {
        "state_id":36,
        "state_name":"West Bengal"
    }
]

function find_state_id(states, user_state_name){
    return new Promise((resolve, reject) =>{
        if(states == []){
            return reject("Empty states list was passed")
        }
        let state_id_to_find
        // let user_state_name = "Uttar Pradesh"
        for(state_detail of states){
            if(state_detail.state_name.toLowerCase() == user_state_name.toLowerCase()){
                state_id_to_find = state_detail.state_id
            }
        }
        if(typeof state_id_to_find == 'undefined'){
            return reject("State Name was wrong!")
        }
        resolve(state_id_to_find)
    })
}

function find_district_id(state_id, user_district_name){
    return new Promise( (resolve, reject) => {
        let district_id_to_find
        // let user_district_name = "Lucknow"

        // get destrict id from state_id_to_find
        req_districts = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/' + state_id.toString()
        console.log("req_districts = " + req_districts)
        request(req_districts, {json : true}, (err, res, body) =>{
            if(err) {
                return reject(err)
            }
            if(typeof res.body.districts == 'undefined'){
                return reject("Something went wrong!")
            }
            console.log(res.body.districts)
            for(list of res.body.districts){
                // console.log(list)
                if(list.district_name.toLowerCase() == user_district_name.toLowerCase()){
                    // console.log("found the place that is at district: " + list.district_name +
                    // " With district id as " + list.district_id)
                    district_id_to_find = list.district_id
                    resolve(district_id_to_find)
                }
            }
            if(typeof district_id_to_find == 'undefined'){
                reject("District Name is Wrong")
            }
        })
    })
}

function check_avail(user_district_id, user_date, user_age){
    let user_age_code = 18
    if(user_age >= 45){
        user_age_code = 45
    }else{
        if(user_age >= 18 && user_age <45){
            user_age_code = 18
        }
    }
    return new Promise( (resolve, reject) => {
        const req_link = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${user_district_id}&date=${user_date}`
        request(req_link, {json : true}, (err, res, body) => {
            if(err) {
                return reject(err)
            }

            let total_data = []
            const centers = res.body.centers
            for(center of centers){
                sessions_of_center = center.sessions
                // console.log(sessions_of_center)
                for(session of sessions_of_center){
                    if(session.min_age_limit == user_age_code){
                        // console.log("hospital name : " + center.name)
                        // console.log("vaccination age : " + session.min_age_limit)
                        // console.log("available_capacity: " + session.available_capacity)
                        // console.log("vaccine: " + session.vaccine)
                        // console.log("slots are : ")
                        // console.log(session.slots)
                        if(session.available_capacity > 0){
                            total_data.push({
                                "hospital_name" : center.name,
                                "vaccination_age" : session.min_age_limit,
                                "capacity" : session.available_capacity,
                                "vaccine_name" : session.vaccine
                            })
                        }
                        else{
                            continue
                        }
                    }
                }
            }
            resolve(total_data)
        })
    })
}


async function task(state_name, district, date_to_find, users_age){
    try{
        const state_id = await find_state_id(states, state_name)
        // console.log(state_id)
        const district_id = await find_district_id(state_id, district)
        // console.log(district_id)
        const total_data = await check_avail(district_id, date_to_find, users_age)
        return total_data
    }
    catch(err){
        console.log(err)
    }
}

// const data_check = task("Uttar Pradesh", "Lucknow", "14-05-2021", 45)

// data_check.then( (result) => console.log(result))

module.exports = task