export interface MetroStation {
  name: string;
  coordinates: [number, number];
  line: "purple" | "green" | "interchange";
}

export const PURPLE_LINE_COORDS: [number, number][] = [
  [12.9168, 77.4649], // Challaghatta
  [12.9197, 77.4831], // Kengeri
  [12.9288, 77.5028], // Jnanabharathi
  [12.9392, 77.5186], // Rajarajeshwari Nagar
  [12.9463, 77.5255], // Nayandahalli
  [12.9535, 77.5317], // Mysuru Road
  [12.9592, 77.5398], // Deepanjali Nagar
  [12.9628, 77.5459], // Attiguppe
  [12.9698, 77.5448], // Vijayanagar
  [12.9739, 77.5539], // Hosahalli
  [12.9754, 77.5649], // Magadi Road
  [12.9756, 77.5728], // Majestic
  [12.9744, 77.5843], // Sir M. Visvesvaraya
  [12.9796, 77.5928], // Vidhana Soudha
  [12.9794, 77.5997], // Cubbon Park
  [12.9757, 77.6068], // M.G. Road
  [12.9732, 77.6171], // Trinity
  [12.9761, 77.6268], // Halasuru
  [12.9784, 77.6386], // Indiranagar
  [12.9860, 77.6449], // SV Road
  [12.9907, 77.6525], // Baiyappanahalli
  [12.9935, 77.6602], // Benniganahalli
  [13.0012, 77.6750], // K.R. Pura
  [12.9967, 77.6805], // Singayyanapalya
  [12.9934, 77.6874], // Garudacharpalya
  [12.9919, 77.6975], // Hoodi Junction
  [12.9902, 77.7071], // Seetharampalya
  [12.9877, 77.7161], // Kundalahalli
  [12.9846, 77.7289], // Nallurhalli
  [12.9791, 77.7340], // Sri Sathya Sai Hospital
  [12.9795, 77.7436], // Pattandur Agrahara
  [12.9892, 77.7508], // Kadugodi Bridge
  [12.9959, 77.7516], // Whitefield
];

export const GREEN_LINE_COORDS: [number, number][] = [
  [13.0610, 77.4890], // Madavara
  [13.0483, 77.5005], // Nagasandra
  [13.0416, 77.5126], // Dasarahalli
  [13.0319, 77.5255], // Jalahalli
  [13.0298, 77.5342], // Peenya Industry
  [13.0326, 77.5345], // Peenya
  [13.0286, 77.5407], // Goraguntepalya
  [13.0232, 77.5501], // Yeshwanthpur
  [13.0145, 77.5541], // Sandal Soap Factory
  [13.0084, 77.5492], // Mahalakshmi
  [12.9984, 77.5502], // Rajajinagar
  [12.9972, 77.5599], // Kuvempu Road
  [12.9909, 77.5649], // Srirampura
  [12.9898, 77.5724], // Mantri Square Sampige Road
  [12.9756, 77.5728], // Majestic
  [12.9616, 77.5739], // Chickpet
  [12.9582, 77.5746], // K.R. Market
  [12.9515, 77.5736], // National College
  [12.9463, 77.5800], // Lalbagh
  [12.9378, 77.5802], // South End Circle
  [12.9298, 77.5801], // Jayanagar
  [12.9213, 77.5802], // RV Road
  [12.9155, 77.5736], // Banashankari
  [12.9069, 77.5738], // J.P. Nagar
  [12.8959, 77.5702], // Yelachenahalli
  [12.8872, 77.5684], // Konanakunte Cross
  [12.8795, 77.5670], // Doddakallasandra
  [12.8687, 77.5649], // Vajrahalli
  [12.8598, 77.5615], // Thalaghattapura
  [12.8496, 77.5582], // Silk Institute
];

export const METRO_STATIONS: MetroStation[] = [
  // Purple Line
  { name: "Challaghatta", coordinates: [12.9168, 77.4649], line: "purple" },
  { name: "Kengeri", coordinates: [12.9197, 77.4831], line: "purple" },
  { name: "Jnanabharathi", coordinates: [12.9288, 77.5028], line: "purple" },
  { name: "Rajarajeshwari Nagar", coordinates: [12.9392, 77.5186], line: "purple" },
  { name: "Nayandahalli", coordinates: [12.9463, 77.5255], line: "purple" },
  { name: "Mysuru Road", coordinates: [12.9535, 77.5317], line: "purple" },
  { name: "Deepanjali Nagar", coordinates: [12.9592, 77.5398], line: "purple" },
  { name: "Attiguppe", coordinates: [12.9628, 77.5459], line: "purple" },
  { name: "Vijayanagar", coordinates: [12.9698, 77.5448], line: "purple" },
  { name: "Hosahalli", coordinates: [12.9739, 77.5539], line: "purple" },
  { name: "Magadi Road", coordinates: [12.9754, 77.5649], line: "purple" },
  { name: "Majestic (Nadaprabhu Kempegowda)", coordinates: [12.9756, 77.5728], line: "interchange" },
  { name: "Sir M. Visvesvaraya", coordinates: [12.9744, 77.5843], line: "purple" },
  { name: "Dr. B.R. Ambedkar (Vidhana Soudha)", coordinates: [12.9796, 77.5928], line: "purple" },
  { name: "Cubbon Park", coordinates: [12.9794, 77.5997], line: "purple" },
  { name: "M.G. Road", coordinates: [12.9757, 77.6068], line: "purple" },
  { name: "Trinity", coordinates: [12.9732, 77.6171], line: "purple" },
  { name: "Halasuru", coordinates: [12.9761, 77.6268], line: "purple" },
  { name: "Indiranagar", coordinates: [12.9784, 77.6386], line: "purple" },
  { name: "Swami Vivekananda Road", coordinates: [12.9860, 77.6449], line: "purple" },
  { name: "Baiyappanahalli", coordinates: [12.9907, 77.6525], line: "purple" },
  { name: "Benniganahalli", coordinates: [12.9935, 77.6602], line: "purple" },
  { name: "K.R. Pura", coordinates: [13.0012, 77.6750], line: "purple" },
  { name: "Singayyanapalya", coordinates: [12.9967, 77.6805], line: "purple" },
  { name: "Garudacharpalya", coordinates: [12.9934, 77.6874], line: "purple" },
  { name: "Hoodi Junction", coordinates: [12.9919, 77.6975], line: "purple" },
  { name: "Seetharampalya", coordinates: [12.9902, 77.7071], line: "purple" },
  { name: "Kundalahalli", coordinates: [12.9877, 77.7161], line: "purple" },
  { name: "Nallurhalli", coordinates: [12.9846, 77.7289], line: "purple" },
  { name: "Sri Sathya Sai Hospital", coordinates: [12.9791, 77.7340], line: "purple" },
  { name: "Pattandur Agrahara", coordinates: [12.9795, 77.7436], line: "purple" },
  { name: "Kadugodi Bridge", coordinates: [12.9892, 77.7508], line: "purple" },
  { name: "Whitefield (Kadugodi)", coordinates: [12.9959, 77.7516], line: "purple" },

  // Green Line
  { name: "Madavara", coordinates: [13.0610, 77.4890], line: "green" },
  { name: "Nagasandra", coordinates: [13.0483, 77.5005], line: "green" },
  { name: "Dasarahalli", coordinates: [13.0416, 77.5126], line: "green" },
  { name: "Jalahalli", coordinates: [13.0319, 77.5255], line: "green" },
  { name: "Peenya Industry", coordinates: [13.0298, 77.5342], line: "green" },
  { name: "Peenya", coordinates: [13.0326, 77.5345], line: "green" },
  { name: "Goraguntepalya", coordinates: [13.0286, 77.5407], line: "green" },
  { name: "Yeshwanthpur", coordinates: [13.0232, 77.5501], line: "green" },
  { name: "Sandal Soap Factory", coordinates: [13.0145, 77.5541], line: "green" },
  { name: "Mahalakshmi", coordinates: [13.0084, 77.5492], line: "green" },
  { name: "Rajajinagar", coordinates: [12.9984, 77.5502], line: "green" },
  { name: "Kuvempu Road", coordinates: [12.9972, 77.5599], line: "green" },
  { name: "Srirampura", coordinates: [12.9909, 77.5649], line: "green" },
  { name: "Mantri Square Sampige Road", coordinates: [12.9898, 77.5724], line: "green" },
  { name: "Chickpet", coordinates: [12.9616, 77.5739], line: "green" },
  { name: "K.R. Market", coordinates: [12.9582, 77.5746], line: "green" },
  { name: "National College", coordinates: [12.9515, 77.5736], line: "green" },
  { name: "Lalbagh", coordinates: [12.9463, 77.5800], line: "green" },
  { name: "South End Circle", coordinates: [12.9378, 77.5802], line: "green" },
  { name: "Jayanagar", coordinates: [12.9298, 77.5801], line: "green" },
  { name: "RV Road", coordinates: [12.9213, 77.5802], line: "green" },
  { name: "Banashankari", coordinates: [12.9155, 77.5736], line: "green" },
  { name: "J.P. Nagar", coordinates: [12.9069, 77.5738], line: "green" },
  { name: "Yelachenahalli", coordinates: [12.8959, 77.5702], line: "green" },
  { name: "Konanakunte Cross", coordinates: [12.8872, 77.5684], line: "green" },
  { name: "Doddakallasandra", coordinates: [12.8795, 77.5670], line: "green" },
  { name: "Vajrahalli", coordinates: [12.8687, 77.5649], line: "green" },
  { name: "Thalaghattapura", coordinates: [12.8598, 77.5615], line: "green" },
  { name: "Silk Institute", coordinates: [12.8496, 77.5582], line: "green" },
];
