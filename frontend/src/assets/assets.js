import add_icon_green from './add_icon_green.png'
import add_icon from './add_icon.png'
import add_icon_white from './add_icon_white.png'
import cross_icon from './cross_icon.png'
import email_icon from './email_icon.png'
import facebook_icon from './facebook_icon.png'
import googleplus_icon from './googleplus_icon.png'
import twitter_icon from './twitter_icon.png'
import profile_icon from './profile_icon.png'
import upload_area from './upload_area.png'
import linkedin_icon from './linkedin_icon.png'
import remove_icon_red from './remove_icon_red.png'
import search_icon from './search_icon.png'
import track_icon from './track.png'
import reported_icon from './reported.png'
import resolved_icon from './resolve.png'
import potholes from './potholes.jpg'
import waste from './waste.jpeg'
import street_light from './street-light.jpeg'

export const assets = {
    add_icon,
    add_icon_green,
    add_icon_white,
    cross_icon,
    email_icon,
    facebook_icon,
    googleplus_icon,
    twitter_icon,
    profile_icon,
    upload_area,
    linkedin_icon,
    remove_icon_red,
    search_icon,
    track_icon,
    resolved_icon,
    reported_icon,
    waste,
    potholes,
    street_light
}

export const issues = [{
    id:1,
    title:"Massive Pothole damaging cars",
    description: "There is a massive crater in the middle lane just pass the intersection",
    image:potholes,
    category:"pothole",
    ward:13,
    location: "Chandranagar",
    status: "reported",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
},
{
    id:2,
    title:"Street light not working",
    description: "Street lights are not working in the middle lane just pass the intersection.It is pitch black and unsafe at night",
    image:street_light,
    category:"streetlight",
    ward:13,
    location: "Chandranagar",
    status: "reported",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
},
{
    id:3,
    title:"Waste dumping on street",
    description: "Someone dumped two old mattresses and several bags of trash blocking the rear alley access",
    image:waste,
    category:"waste",
    ward:13,
    location: "Chandranagar",
    status: "in-progress",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
},
{
    id:4,
    title:"Massive Pothole damaging cars",
    description: "There is a massive crater in the middle lane just pass the intersection",
    image:potholes,
    category:"pothole",
    ward:13,
    location: "Chandranagar",
    status: "resolved",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
},
{
    id:5,
    title:"Street light not working",
    description: "Street lights are not working in the middle lane just pass the intersection",
    image:street_light,
    category:"streetlight",
    ward:13,
    location: "Chandranagar",
    status: "reported",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
},
{
    id:6,
    title:"Massive Pothole damaging cars",
    description: "There is a massive crater in the middle lane just pass the intersection",
    image:potholes,
    category:"pothole",
    ward:13,
    location: "Chandranagar",
    status: "resolved",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
},
{
    id:7,
    title:"Street light not working",
    description: "Street lights are not working in the middle lane just pass the intersection.It is pitch black and unsafe at night",
    image:street_light,
    category:"streetlight",
    ward:13,
    location: "Chandranagar",
    status: "in-progress",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
},
{
    id:8,
    title:"Waste dumping on street",
    description: "Someone dumped two old mattresses and several bags of trash blocking the rear alley access",
    image:waste,
    category:"streetlight",
    ward:13,
    location: "Chandranagar",
    status: "resolved",
    date: "27 April 2026",
    votes:142,
    createdBy : "Goutham"
}
]


