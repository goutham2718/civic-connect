import 'dotenv/config'
import localBodyModel from '../models/LocalbodyModel.js';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';


// ✅ Confirmed municipalities (7)
const municipalities = [
  { name: 'Palakkad Municipality', type: 'municipality' },
  { name: 'Ottapalam Municipality', type: 'municipality' },
  { name: 'Shornur Municipality', type: 'municipality' },
  { name: 'Chittur-Tattamangalam Municipality', type: 'municipality' },
  { name: 'Pattambi Municipality', type: 'municipality' },
  { name: 'Cherpulassery Municipality', type: 'municipality' },
  { name: 'Mannarkkad Municipality', type: 'municipality' },
];


const panchayats = [
  { name: 'Agali', type: 'panchayat', block: 'Attappady' },
  { name: 'Akathethara', type: 'panchayat', block: 'Malampuzha' },
  { name: 'Alanallur', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Alathur', type: 'panchayat', block: 'Alathur' },
  { name: 'Ambalappara', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Anakkara', type: 'panchayat', block: 'Thrithala' },
  { name: 'Ananganadi', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Ayiloor', type: 'panchayat', block: 'Nenmara' },
  { name: 'Chalavara', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Chalissery', type: 'panchayat', block: 'Thrithala' },
  { name: 'Elappully', type: 'panchayat', block: 'Chittur' },
  { name: 'Elavancherry', type: 'panchayat', block: 'Nenmara' },
  { name: 'Erimayur', type: 'panchayat', block: 'Alathur' },
  { name: 'Eruthenpathy', type: 'panchayat', block: 'Chittur' },
  { name: 'Kadampazhipuram', type: 'panchayat', block: 'Sreekrishnapuram' },
  { name: 'Kannadi', type: 'panchayat', block: 'Kuzhalmannam' },
  { name: 'Kannambra', type: 'panchayat', block: 'Alathur' },
  { name: 'Kanhirapuzha', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Karakurussi', type: 'panchayat', block: 'Sreekrishnapuram' },
  { name: 'Karimba', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Kavassery', type: 'panchayat', block: 'Alathur' },
  { name: 'Keralassery', type: 'panchayat', block: 'Palakkad' },
  { name: 'Kizhakkencherry', type: 'panchayat', block: 'Alathur' },
  { name: 'Kodumbu', type: 'panchayat', block: 'Malampuzha' },
  { name: 'Koduvayur', type: 'panchayat', block: 'Kollengode' },
  { name: 'Kollengode', type: 'panchayat', block: 'Kollengode' },
  { name: 'Kongad', type: 'panchayat', block: 'Palakkad' },
  { name: 'Koppam', type: 'panchayat', block: 'Pattambi' },
  { name: 'Kottayi', type: 'panchayat', block: 'Kuzhalmannam' },
  { name: 'Kottopadam', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Kozhinjampara', type: 'panchayat', block: 'Chittur' },
  { name: 'Kulukkallur', type: 'panchayat', block: 'Pattambi' },
  { name: 'Kumaramputhur', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Kuthanur', type: 'panchayat', block: 'Kuzhalmannam' },
  { name: 'Kuzhalmannam', type: 'panchayat', block: 'Kuzhalmannam' },
  { name: 'Lakkidi - Perur', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Malampuzha', type: 'panchayat', block: 'Malampuzha' },
  { name: 'Mankara', type: 'panchayat', block: 'Palakkad' },
  { name: 'Mannur', type: 'panchayat', block: 'Palakkad' },
  { name: 'Marutharode', type: 'panchayat', block: 'Malampuzha' },
  { name: 'Mathur', type: 'panchayat', block: 'Kuzhalmannam' },
  { name: 'Melarcode', type: 'panchayat', block: 'Nenmara' },
  { name: 'Mundur', type: 'panchayat', block: 'Malampuzha' },
  { name: 'Muthalamada', type: 'panchayat', block: 'Kollengode' },
  { name: 'Muthuthala', type: 'panchayat', block: 'Pattambi' },
  { name: 'Nagalassery', type: 'panchayat', block: 'Thrithala' },
  { name: 'Nallepilly', type: 'panchayat', block: 'Chittur' },
  { name: 'Nellaya', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Nelliyampathy', type: 'panchayat', block: 'Nenmara' },
  { name: 'Nenmara', type: 'panchayat', block: 'Nenmara' },
  { name: 'Ongallur', type: 'panchayat', block: 'Pattambi' },
  { name: 'Pallassana', type: 'panchayat', block: 'Nenmara' },
  { name: 'Parali', type: 'panchayat', block: 'Palakkad' },
  { name: 'Paruthur', type: 'panchayat', block: 'Pattambi' },
  { name: 'Pattanchery', type: 'panchayat', block: 'Chittur' },
  { name: 'Pattithara', type: 'panchayat', block: 'Thrithala' },
  { name: 'Perumatty', type: 'panchayat', block: 'Chittur' },
  { name: 'Perungottukurissi', type: 'panchayat', block: 'Kuzhalmannam' },
  { name: 'Peruvemba', type: 'panchayat', block: 'Kollengode' },
  { name: 'Pirayiri', type: 'panchayat', block: 'Palakkad' },
  { name: 'Polpully', type: 'panchayat', block: 'Chittur' },
  { name: 'Pookkottukavu', type: 'panchayat', block: 'Sreekrishnapuram' },
  { name: 'Puducode', type: 'panchayat', block: 'Alathur' },
  { name: 'Pudunagaram', type: 'panchayat', block: 'Kollengode' },
  { name: 'Puduppariyaram', type: 'panchayat', block: 'Malampuzha' },
  { name: 'Pudusseri', type: 'panchayat', block: 'Malampuzha' },
  { name: 'Pudur', type: 'panchayat', block: 'Attappady' },
  { name: 'Sholayoor', type: 'panchayat', block: 'Attappady' },
  { name: 'Sreekrishnapuram', type: 'panchayat', block: 'Sreekrishnapuram' },
  { name: 'Tarur', type: 'panchayat', block: 'Alathur' },
  { name: 'Thachanattukara', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Thachampara', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Thenkara', type: 'panchayat', block: 'Mannarkkad' },
  { name: 'Thenkurissi', type: 'panchayat', block: 'Kuzhalmannam' },
  { name: 'Thirumittacode', type: 'panchayat', block: 'Thrithala' },
  { name: 'Thiruvegappura', type: 'panchayat', block: 'Pattambi' },
  { name: 'Thrikkaderi', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Thrithala', type: 'panchayat', block: 'Thrithala' },
  { name: 'Vadakarapathy', type: 'panchayat', block: 'Chittur' },
  { name: 'Vadavannur', type: 'panchayat', block: 'Kollengode' },
  { name: 'Vadakkencheri', type: 'panchayat', block: 'Alathur' },
  { name: 'Vallapuzha', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Vandazhy', type: 'panchayat', block: 'Nenmara' },
  { name: 'Vaniamkulam', type: 'panchayat', block: 'Ottapalam' },
  { name: 'Vellinezhi', type: 'panchayat', block: 'Sreekrishnapuram' },
  { name: 'Vilayur', type: 'panchayat', block: 'Pattambi' }
];

const seed = async () => {
  try {
    connectDB()
    console.log('Connected to MongoDB');

    await localBodyModel.deleteMany({}); // reset before reseeding
    await localBodyModel.insertMany([...municipalities, ...panchayats]);

    console.log(`Seeded ${municipalities.length} municipalities and ${panchayats.length} panchayats`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
  }
};

seed();