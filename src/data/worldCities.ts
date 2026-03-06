export interface WorldCity {
  name: string;
  country: string;
  countryCode: string; // ISO 3166-1 numeric code
  lat: number;
  lng: number;
}

export const WORLD_CITIES: WorldCity[] = [
  // Afghanistan - 004
  { name: "Kabul", country: "Afghanistan", countryCode: "004", lat: 34.5553, lng: 69.2075 },
  { name: "Herat", country: "Afghanistan", countryCode: "004", lat: 34.3529, lng: 62.2040 },
  { name: "Kandahar", country: "Afghanistan", countryCode: "004", lat: 31.6257, lng: 65.7101 },
  { name: "Mazar-i-Sharif", country: "Afghanistan", countryCode: "004", lat: 36.7069, lng: 67.1147 },

  // Albania - 008
  { name: "Tirana", country: "Albania", countryCode: "008", lat: 41.3275, lng: 19.8187 },

  // Algeria - 012
  { name: "Algiers", country: "Algeria", countryCode: "012", lat: 36.7538, lng: 3.0588 },
  { name: "Oran", country: "Algeria", countryCode: "012", lat: 35.6969, lng: -0.6331 },
  { name: "Constantine", country: "Algeria", countryCode: "012", lat: 36.3650, lng: 6.6147 },

  // Andorra - 020
  { name: "Andorra la Vella", country: "Andorra", countryCode: "020", lat: 42.5063, lng: 1.5218 },

  // Angola - 024
  { name: "Luanda", country: "Angola", countryCode: "024", lat: -8.8390, lng: 13.2894 },
  { name: "Huambo", country: "Angola", countryCode: "024", lat: -12.7761, lng: 15.7394 },

  // Antigua and Barbuda - 028
  { name: "St. John's", country: "Antigua and Barbuda", countryCode: "028", lat: 17.1274, lng: -61.8468 },

  // Argentina - 032
  { name: "Buenos Aires", country: "Argentina", countryCode: "032", lat: -34.6037, lng: -58.3816 },
  { name: "Cordoba", country: "Argentina", countryCode: "032", lat: -31.4201, lng: -64.1888 },
  { name: "Mendoza", country: "Argentina", countryCode: "032", lat: -32.8895, lng: -68.8458 },
  { name: "Rosario", country: "Argentina", countryCode: "032", lat: -32.9468, lng: -60.6393 },
  { name: "Mar del Plata", country: "Argentina", countryCode: "032", lat: -38.0055, lng: -57.5426 },
  { name: "Bariloche", country: "Argentina", countryCode: "032", lat: -41.1335, lng: -71.3103 },

  // Armenia - 051
  { name: "Yerevan", country: "Armenia", countryCode: "051", lat: 40.1792, lng: 44.4991 },

  // Australia - 036
  { name: "Adelaide", country: "Australia", countryCode: "036", lat: -34.9285, lng: 138.6007 },
  { name: "Brisbane", country: "Australia", countryCode: "036", lat: -27.4698, lng: 153.0251 },
  { name: "Cairns", country: "Australia", countryCode: "036", lat: -16.9186, lng: 145.7781 },
  { name: "Canberra", country: "Australia", countryCode: "036", lat: -35.2809, lng: 149.1300 },
  { name: "Darwin", country: "Australia", countryCode: "036", lat: -12.4634, lng: 130.8456 },
  { name: "Gold Coast", country: "Australia", countryCode: "036", lat: -28.0167, lng: 153.4000 },
  { name: "Hobart", country: "Australia", countryCode: "036", lat: -42.8821, lng: 147.3272 },
  { name: "Melbourne", country: "Australia", countryCode: "036", lat: -37.8136, lng: 144.9631 },
  { name: "Perth", country: "Australia", countryCode: "036", lat: -31.9505, lng: 115.8605 },
  { name: "Sydney", country: "Australia", countryCode: "036", lat: -33.8688, lng: 151.2093 },

  // Austria - 040
  { name: "Graz", country: "Austria", countryCode: "040", lat: 47.0707, lng: 15.4395 },
  { name: "Innsbruck", country: "Austria", countryCode: "040", lat: 47.2692, lng: 11.4041 },
  { name: "Salzburg", country: "Austria", countryCode: "040", lat: 47.8095, lng: 13.0550 },
  { name: "Vienna", country: "Austria", countryCode: "040", lat: 48.2082, lng: 16.3738 },

  // Azerbaijan - 031
  { name: "Baku", country: "Azerbaijan", countryCode: "031", lat: 40.4093, lng: 49.8671 },

  // Bahamas - 044
  { name: "Nassau", country: "Bahamas", countryCode: "044", lat: 25.0343, lng: -77.3963 },

  // Bahrain - 048
  { name: "Manama", country: "Bahrain", countryCode: "048", lat: 26.2285, lng: 50.5860 },

  // Bangladesh - 050
  { name: "Chittagong", country: "Bangladesh", countryCode: "050", lat: 22.3569, lng: 91.7832 },
  { name: "Dhaka", country: "Bangladesh", countryCode: "050", lat: 23.8103, lng: 90.4125 },
  { name: "Khulna", country: "Bangladesh", countryCode: "050", lat: 22.8456, lng: 89.5403 },
  { name: "Sylhet", country: "Bangladesh", countryCode: "050", lat: 24.8949, lng: 91.8687 },

  // Barbados - 052
  { name: "Bridgetown", country: "Barbados", countryCode: "052", lat: 13.1132, lng: -59.5988 },

  // Belarus - 112
  { name: "Minsk", country: "Belarus", countryCode: "112", lat: 53.9006, lng: 27.5590 },
  { name: "Gomel", country: "Belarus", countryCode: "112", lat: 52.4345, lng: 30.9754 },

  // Belgium - 056
  { name: "Antwerp", country: "Belgium", countryCode: "056", lat: 51.2194, lng: 4.4025 },
  { name: "Bruges", country: "Belgium", countryCode: "056", lat: 51.2093, lng: 3.2247 },
  { name: "Brussels", country: "Belgium", countryCode: "056", lat: 50.8503, lng: 4.3517 },
  { name: "Ghent", country: "Belgium", countryCode: "056", lat: 51.0543, lng: 3.7174 },

  // Belize - 084
  { name: "Belmopan", country: "Belize", countryCode: "084", lat: 17.2510, lng: -88.7590 },

  // Benin - 204
  { name: "Porto-Novo", country: "Benin", countryCode: "204", lat: 6.4969, lng: 2.6289 },
  { name: "Cotonou", country: "Benin", countryCode: "204", lat: 6.3703, lng: 2.3912 },

  // Bhutan - 064
  { name: "Thimphu", country: "Bhutan", countryCode: "064", lat: 27.4728, lng: 89.6390 },

  // Bolivia - 068
  { name: "La Paz", country: "Bolivia", countryCode: "068", lat: -16.4897, lng: -68.1193 },
  { name: "Santa Cruz de la Sierra", country: "Bolivia", countryCode: "068", lat: -17.7833, lng: -63.1822 },
  { name: "Sucre", country: "Bolivia", countryCode: "068", lat: -19.0196, lng: -65.2619 },

  // Bosnia and Herzegovina - 070
  { name: "Sarajevo", country: "Bosnia and Herzegovina", countryCode: "070", lat: 43.8563, lng: 18.4131 },
  { name: "Mostar", country: "Bosnia and Herzegovina", countryCode: "070", lat: 43.3438, lng: 17.8078 },

  // Botswana - 072
  { name: "Gaborone", country: "Botswana", countryCode: "072", lat: -24.6282, lng: 25.9231 },

  // Brazil - 076
  { name: "Belo Horizonte", country: "Brazil", countryCode: "076", lat: -19.9167, lng: -43.9345 },
  { name: "Brasilia", country: "Brazil", countryCode: "076", lat: -15.7975, lng: -47.8919 },
  { name: "Curitiba", country: "Brazil", countryCode: "076", lat: -25.4284, lng: -49.2733 },
  { name: "Florianopolis", country: "Brazil", countryCode: "076", lat: -27.5954, lng: -48.5480 },
  { name: "Fortaleza", country: "Brazil", countryCode: "076", lat: -3.7172, lng: -38.5433 },
  { name: "Manaus", country: "Brazil", countryCode: "076", lat: -3.1190, lng: -60.0217 },
  { name: "Porto Alegre", country: "Brazil", countryCode: "076", lat: -30.0346, lng: -51.2177 },
  { name: "Recife", country: "Brazil", countryCode: "076", lat: -8.0476, lng: -34.8770 },
  { name: "Rio de Janeiro", country: "Brazil", countryCode: "076", lat: -22.9068, lng: -43.1729 },
  { name: "Salvador", country: "Brazil", countryCode: "076", lat: -12.9714, lng: -38.5124 },
  { name: "Sao Paulo", country: "Brazil", countryCode: "076", lat: -23.5505, lng: -46.6333 },

  // Brunei - 096
  { name: "Bandar Seri Begawan", country: "Brunei", countryCode: "096", lat: 4.9031, lng: 114.9398 },

  // Bulgaria - 100
  { name: "Sofia", country: "Bulgaria", countryCode: "100", lat: 42.6977, lng: 23.3219 },
  { name: "Plovdiv", country: "Bulgaria", countryCode: "100", lat: 42.1354, lng: 24.7453 },

  // Burkina Faso - 854
  { name: "Ouagadougou", country: "Burkina Faso", countryCode: "854", lat: 12.3714, lng: -1.5197 },

  // Burundi - 108
  { name: "Gitega", country: "Burundi", countryCode: "108", lat: -3.4264, lng: 29.9246 },
  { name: "Bujumbura", country: "Burundi", countryCode: "108", lat: -3.3614, lng: 29.3599 },

  // Cambodia - 116
  { name: "Phnom Penh", country: "Cambodia", countryCode: "116", lat: 11.5564, lng: 104.9282 },
  { name: "Siem Reap", country: "Cambodia", countryCode: "116", lat: 13.3633, lng: 103.8600 },

  // Cameroon - 120
  { name: "Yaounde", country: "Cameroon", countryCode: "120", lat: 3.8480, lng: 11.5021 },
  { name: "Douala", country: "Cameroon", countryCode: "120", lat: 4.0511, lng: 9.7679 },

  // Canada - 124
  { name: "Calgary", country: "Canada", countryCode: "124", lat: 51.0447, lng: -114.0719 },
  { name: "Edmonton", country: "Canada", countryCode: "124", lat: 53.5461, lng: -113.4938 },
  { name: "Halifax", country: "Canada", countryCode: "124", lat: 44.6488, lng: -63.5752 },
  { name: "Montreal", country: "Canada", countryCode: "124", lat: 45.5017, lng: -73.5673 },
  { name: "Ottawa", country: "Canada", countryCode: "124", lat: 45.4215, lng: -75.6972 },
  { name: "Quebec City", country: "Canada", countryCode: "124", lat: 46.8139, lng: -71.2080 },
  { name: "Toronto", country: "Canada", countryCode: "124", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", country: "Canada", countryCode: "124", lat: 49.2827, lng: -123.1207 },
  { name: "Victoria", country: "Canada", countryCode: "124", lat: 48.4284, lng: -123.3656 },
  { name: "Winnipeg", country: "Canada", countryCode: "124", lat: 49.8951, lng: -97.1384 },

  // Cape Verde - 132
  { name: "Praia", country: "Cape Verde", countryCode: "132", lat: 14.9331, lng: -23.5133 },

  // Central African Republic - 140
  { name: "Bangui", country: "Central African Republic", countryCode: "140", lat: 4.3947, lng: 18.5582 },

  // Chad - 148
  { name: "N'Djamena", country: "Chad", countryCode: "148", lat: 12.1348, lng: 15.0557 },

  // Chile - 152
  { name: "Santiago", country: "Chile", countryCode: "152", lat: -33.4489, lng: -70.6693 },
  { name: "Valparaiso", country: "Chile", countryCode: "152", lat: -33.0472, lng: -71.6127 },
  { name: "Concepcion", country: "Chile", countryCode: "152", lat: -36.8270, lng: -73.0498 },
  { name: "Punta Arenas", country: "Chile", countryCode: "152", lat: -53.1548, lng: -70.9113 },

  // China - 156
  { name: "Beijing", country: "China", countryCode: "156", lat: 39.9042, lng: 116.4074 },
  { name: "Chengdu", country: "China", countryCode: "156", lat: 30.5728, lng: 104.0668 },
  { name: "Chongqing", country: "China", countryCode: "156", lat: 29.4316, lng: 106.9123 },
  { name: "Guangzhou", country: "China", countryCode: "156", lat: 23.1291, lng: 113.2644 },
  { name: "Hangzhou", country: "China", countryCode: "156", lat: 30.2741, lng: 120.1551 },
  { name: "Harbin", country: "China", countryCode: "156", lat: 45.8038, lng: 126.5350 },
  { name: "Hong Kong", country: "China", countryCode: "156", lat: 22.3193, lng: 114.1694 },
  { name: "Kunming", country: "China", countryCode: "156", lat: 25.0389, lng: 102.7183 },
  { name: "Lhasa", country: "China", countryCode: "156", lat: 29.6500, lng: 91.1000 },
  { name: "Nanjing", country: "China", countryCode: "156", lat: 32.0603, lng: 118.7969 },
  { name: "Shanghai", country: "China", countryCode: "156", lat: 31.2304, lng: 121.4737 },
  { name: "Shenzhen", country: "China", countryCode: "156", lat: 22.5431, lng: 114.0579 },
  { name: "Tianjin", country: "China", countryCode: "156", lat: 39.3434, lng: 117.3616 },
  { name: "Urumqi", country: "China", countryCode: "156", lat: 43.8256, lng: 87.6168 },
  { name: "Wuhan", country: "China", countryCode: "156", lat: 30.5928, lng: 114.3055 },
  { name: "Xi'an", country: "China", countryCode: "156", lat: 34.3416, lng: 108.9398 },

  // Colombia - 170
  { name: "Bogota", country: "Colombia", countryCode: "170", lat: 4.7110, lng: -74.0721 },
  { name: "Cartagena", country: "Colombia", countryCode: "170", lat: 10.3910, lng: -75.5364 },
  { name: "Medellin", country: "Colombia", countryCode: "170", lat: 6.2476, lng: -75.5658 },
  { name: "Cali", country: "Colombia", countryCode: "170", lat: 3.4516, lng: -76.5320 },
  { name: "Barranquilla", country: "Colombia", countryCode: "170", lat: 10.9685, lng: -74.7813 },

  // Comoros - 174
  { name: "Moroni", country: "Comoros", countryCode: "174", lat: -11.7172, lng: 43.2551 },

  // Congo (DRC) - 180
  { name: "Kinshasa", country: "Congo (DRC)", countryCode: "180", lat: -4.4419, lng: 15.2663 },
  { name: "Lubumbashi", country: "Congo (DRC)", countryCode: "180", lat: -11.6647, lng: 27.4794 },

  // Congo (Republic) - 178
  { name: "Brazzaville", country: "Congo (Republic)", countryCode: "178", lat: -4.2634, lng: 15.2429 },

  // Costa Rica - 188
  { name: "San Jose", country: "Costa Rica", countryCode: "188", lat: 9.9281, lng: -84.0907 },

  // Croatia - 191
  { name: "Dubrovnik", country: "Croatia", countryCode: "191", lat: 42.6507, lng: 18.0944 },
  { name: "Split", country: "Croatia", countryCode: "191", lat: 43.5081, lng: 16.4402 },
  { name: "Zagreb", country: "Croatia", countryCode: "191", lat: 45.8150, lng: 15.9819 },

  // Cuba - 192
  { name: "Havana", country: "Cuba", countryCode: "192", lat: 23.1136, lng: -82.3666 },
  { name: "Santiago de Cuba", country: "Cuba", countryCode: "192", lat: 20.0174, lng: -75.8314 },

  // Cyprus - 196
  { name: "Nicosia", country: "Cyprus", countryCode: "196", lat: 35.1856, lng: 33.3823 },
  { name: "Limassol", country: "Cyprus", countryCode: "196", lat: 34.7071, lng: 33.0226 },

  // Czech Republic - 203
  { name: "Brno", country: "Czech Republic", countryCode: "203", lat: 49.1951, lng: 16.6068 },
  { name: "Prague", country: "Czech Republic", countryCode: "203", lat: 50.0755, lng: 14.4378 },

  // Denmark - 208
  { name: "Aarhus", country: "Denmark", countryCode: "208", lat: 56.1629, lng: 10.2039 },
  { name: "Copenhagen", country: "Denmark", countryCode: "208", lat: 55.6761, lng: 12.5683 },

  // Djibouti - 262
  { name: "Djibouti", country: "Djibouti", countryCode: "262", lat: 11.5721, lng: 43.1456 },

  // Dominica - 212
  { name: "Roseau", country: "Dominica", countryCode: "212", lat: 15.3010, lng: -61.3870 },

  // Dominican Republic - 214
  { name: "Santo Domingo", country: "Dominican Republic", countryCode: "214", lat: 18.4861, lng: -69.9312 },
  { name: "Punta Cana", country: "Dominican Republic", countryCode: "214", lat: 18.5601, lng: -68.3725 },

  // Ecuador - 218
  { name: "Guayaquil", country: "Ecuador", countryCode: "218", lat: -2.1710, lng: -79.9224 },
  { name: "Quito", country: "Ecuador", countryCode: "218", lat: -0.1807, lng: -78.4678 },
  { name: "Cuenca", country: "Ecuador", countryCode: "218", lat: -2.9001, lng: -79.0059 },

  // Egypt - 818
  { name: "Alexandria", country: "Egypt", countryCode: "818", lat: 31.2001, lng: 29.9187 },
  { name: "Aswan", country: "Egypt", countryCode: "818", lat: 24.0889, lng: 32.8998 },
  { name: "Cairo", country: "Egypt", countryCode: "818", lat: 30.0444, lng: 31.2357 },
  { name: "Hurghada", country: "Egypt", countryCode: "818", lat: 27.2579, lng: 33.8116 },
  { name: "Luxor", country: "Egypt", countryCode: "818", lat: 25.6872, lng: 32.6396 },
  { name: "Sharm El Sheikh", country: "Egypt", countryCode: "818", lat: 27.9158, lng: 34.3300 },

  // El Salvador - 222
  { name: "San Salvador", country: "El Salvador", countryCode: "222", lat: 13.6929, lng: -89.2182 },

  // Equatorial Guinea - 226
  { name: "Malabo", country: "Equatorial Guinea", countryCode: "226", lat: 3.7504, lng: 8.7371 },

  // Eritrea - 232
  { name: "Asmara", country: "Eritrea", countryCode: "232", lat: 15.3229, lng: 38.9251 },

  // Estonia - 233
  { name: "Tallinn", country: "Estonia", countryCode: "233", lat: 59.4370, lng: 24.7536 },
  { name: "Tartu", country: "Estonia", countryCode: "233", lat: 58.3780, lng: 26.7290 },

  // Eswatini - 748
  { name: "Mbabane", country: "Eswatini", countryCode: "748", lat: -26.3054, lng: 31.1367 },

  // Ethiopia - 231
  { name: "Addis Ababa", country: "Ethiopia", countryCode: "231", lat: 9.0250, lng: 38.7469 },
  { name: "Dire Dawa", country: "Ethiopia", countryCode: "231", lat: 9.6009, lng: 41.8503 },

  // Fiji - 242
  { name: "Suva", country: "Fiji", countryCode: "242", lat: -18.1416, lng: 178.4419 },

  // Finland - 246
  { name: "Helsinki", country: "Finland", countryCode: "246", lat: 60.1699, lng: 24.9384 },
  { name: "Rovaniemi", country: "Finland", countryCode: "246", lat: 66.5039, lng: 25.7294 },
  { name: "Tampere", country: "Finland", countryCode: "246", lat: 61.4978, lng: 23.7610 },
  { name: "Turku", country: "Finland", countryCode: "246", lat: 60.4518, lng: 22.2666 },

  // France - 250
  { name: "Bordeaux", country: "France", countryCode: "250", lat: 44.8378, lng: -0.5792 },
  { name: "Lille", country: "France", countryCode: "250", lat: 50.6292, lng: 3.0573 },
  { name: "Lyon", country: "France", countryCode: "250", lat: 45.7640, lng: 4.8357 },
  { name: "Marseille", country: "France", countryCode: "250", lat: 43.2965, lng: 5.3698 },
  { name: "Nice", country: "France", countryCode: "250", lat: 43.7102, lng: 7.2620 },
  { name: "Paris", country: "France", countryCode: "250", lat: 48.8566, lng: 2.3522 },
  { name: "Strasbourg", country: "France", countryCode: "250", lat: 48.5734, lng: 7.7521 },
  { name: "Toulouse", country: "France", countryCode: "250", lat: 43.6047, lng: 1.4442 },

  // Gabon - 266
  { name: "Libreville", country: "Gabon", countryCode: "266", lat: 0.4162, lng: 9.4673 },

  // Gambia - 270
  { name: "Banjul", country: "Gambia", countryCode: "270", lat: 13.4549, lng: -16.5790 },

  // Georgia - 268
  { name: "Tbilisi", country: "Georgia", countryCode: "268", lat: 41.7151, lng: 44.8271 },
  { name: "Batumi", country: "Georgia", countryCode: "268", lat: 41.6168, lng: 41.6367 },

  // Germany - 276
  { name: "Berlin", country: "Germany", countryCode: "276", lat: 52.5200, lng: 13.4050 },
  { name: "Cologne", country: "Germany", countryCode: "276", lat: 50.9375, lng: 6.9603 },
  { name: "Dresden", country: "Germany", countryCode: "276", lat: 51.0504, lng: 13.7373 },
  { name: "Dusseldorf", country: "Germany", countryCode: "276", lat: 51.2277, lng: 6.7735 },
  { name: "Frankfurt", country: "Germany", countryCode: "276", lat: 50.1109, lng: 8.6821 },
  { name: "Hamburg", country: "Germany", countryCode: "276", lat: 53.5511, lng: 9.9937 },
  { name: "Leipzig", country: "Germany", countryCode: "276", lat: 51.3397, lng: 12.3731 },
  { name: "Munich", country: "Germany", countryCode: "276", lat: 48.1351, lng: 11.5820 },
  { name: "Nuremberg", country: "Germany", countryCode: "276", lat: 49.4521, lng: 11.0767 },
  { name: "Stuttgart", country: "Germany", countryCode: "276", lat: 48.7758, lng: 9.1829 },

  // Ghana - 288
  { name: "Accra", country: "Ghana", countryCode: "288", lat: 5.6037, lng: -0.1870 },
  { name: "Kumasi", country: "Ghana", countryCode: "288", lat: 6.6885, lng: -1.6244 },

  // Greece - 300
  { name: "Athens", country: "Greece", countryCode: "300", lat: 37.9838, lng: 23.7275 },
  { name: "Heraklion", country: "Greece", countryCode: "300", lat: 35.3387, lng: 25.1442 },
  { name: "Rhodes", country: "Greece", countryCode: "300", lat: 36.4341, lng: 28.2176 },
  { name: "Santorini", country: "Greece", countryCode: "300", lat: 36.3932, lng: 25.4615 },
  { name: "Thessaloniki", country: "Greece", countryCode: "300", lat: 40.6401, lng: 22.9444 },

  // Grenada - 308
  { name: "St. George's", country: "Grenada", countryCode: "308", lat: 12.0564, lng: -61.7485 },

  // Guatemala - 320
  { name: "Guatemala City", country: "Guatemala", countryCode: "320", lat: 14.6349, lng: -90.5069 },
  { name: "Antigua Guatemala", country: "Guatemala", countryCode: "320", lat: 14.5586, lng: -90.7295 },

  // Guinea - 324
  { name: "Conakry", country: "Guinea", countryCode: "324", lat: 9.6412, lng: -13.5784 },

  // Guinea-Bissau - 624
  { name: "Bissau", country: "Guinea-Bissau", countryCode: "624", lat: 11.8037, lng: -15.1804 },

  // Guyana - 328
  { name: "Georgetown", country: "Guyana", countryCode: "328", lat: 6.8013, lng: -58.1551 },

  // Haiti - 332
  { name: "Port-au-Prince", country: "Haiti", countryCode: "332", lat: 18.5944, lng: -72.3074 },

  // Honduras - 340
  { name: "Tegucigalpa", country: "Honduras", countryCode: "340", lat: 14.0723, lng: -87.1921 },

  // Hungary - 348
  { name: "Budapest", country: "Hungary", countryCode: "348", lat: 47.4979, lng: 19.0402 },
  { name: "Debrecen", country: "Hungary", countryCode: "348", lat: 47.5316, lng: 21.6273 },

  // Iceland - 352
  { name: "Reykjavik", country: "Iceland", countryCode: "352", lat: 64.1466, lng: -21.9426 },

  // India - 356
  { name: "Agra", country: "India", countryCode: "356", lat: 27.1767, lng: 78.0081 },
  { name: "Ahmedabad", country: "India", countryCode: "356", lat: 23.0225, lng: 72.5714 },
  { name: "Bangalore", country: "India", countryCode: "356", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", country: "India", countryCode: "356", lat: 13.0827, lng: 80.2707 },
  { name: "Delhi", country: "India", countryCode: "356", lat: 28.7041, lng: 77.1025 },
  { name: "Goa", country: "India", countryCode: "356", lat: 15.2993, lng: 74.1240 },
  { name: "Hyderabad", country: "India", countryCode: "356", lat: 17.3850, lng: 78.4867 },
  { name: "Jaipur", country: "India", countryCode: "356", lat: 26.9124, lng: 75.7873 },
  { name: "Kochi", country: "India", countryCode: "356", lat: 9.9312, lng: 76.2673 },
  { name: "Kolkata", country: "India", countryCode: "356", lat: 22.5726, lng: 88.3639 },
  { name: "Lucknow", country: "India", countryCode: "356", lat: 26.8467, lng: 80.9462 },
  { name: "Mumbai", country: "India", countryCode: "356", lat: 19.0760, lng: 72.8777 },
  { name: "New Delhi", country: "India", countryCode: "356", lat: 28.6139, lng: 77.2090 },
  { name: "Pune", country: "India", countryCode: "356", lat: 18.5204, lng: 73.8567 },
  { name: "Varanasi", country: "India", countryCode: "356", lat: 25.3176, lng: 82.9739 },

  // Indonesia - 360
  { name: "Bali", country: "Indonesia", countryCode: "360", lat: -8.3405, lng: 115.0920 },
  { name: "Bandung", country: "Indonesia", countryCode: "360", lat: -6.9175, lng: 107.6191 },
  { name: "Jakarta", country: "Indonesia", countryCode: "360", lat: -6.2088, lng: 106.8456 },
  { name: "Makassar", country: "Indonesia", countryCode: "360", lat: -5.1477, lng: 119.4327 },
  { name: "Medan", country: "Indonesia", countryCode: "360", lat: 3.5952, lng: 98.6722 },
  { name: "Surabaya", country: "Indonesia", countryCode: "360", lat: -7.2575, lng: 112.7521 },
  { name: "Yogyakarta", country: "Indonesia", countryCode: "360", lat: -7.7956, lng: 110.3695 },

  // Iran - 364
  { name: "Isfahan", country: "Iran", countryCode: "364", lat: 32.6546, lng: 51.6680 },
  { name: "Shiraz", country: "Iran", countryCode: "364", lat: 29.5918, lng: 52.5837 },
  { name: "Tehran", country: "Iran", countryCode: "364", lat: 35.6892, lng: 51.3890 },
  { name: "Tabriz", country: "Iran", countryCode: "364", lat: 38.0800, lng: 46.2919 },
  { name: "Mashhad", country: "Iran", countryCode: "364", lat: 36.2605, lng: 59.6168 },

  // Iraq - 368
  { name: "Baghdad", country: "Iraq", countryCode: "368", lat: 33.3152, lng: 44.3661 },
  { name: "Basra", country: "Iraq", countryCode: "368", lat: 30.5085, lng: 47.7804 },
  { name: "Erbil", country: "Iraq", countryCode: "368", lat: 36.1912, lng: 44.0119 },

  // Ireland - 372
  { name: "Cork", country: "Ireland", countryCode: "372", lat: 51.8969, lng: -8.4863 },
  { name: "Dublin", country: "Ireland", countryCode: "372", lat: 53.3498, lng: -6.2603 },
  { name: "Galway", country: "Ireland", countryCode: "372", lat: 53.2707, lng: -9.0568 },

  // Israel - 376
  { name: "Eilat", country: "Israel", countryCode: "376", lat: 29.5577, lng: 34.9519 },
  { name: "Haifa", country: "Israel", countryCode: "376", lat: 32.7940, lng: 34.9896 },
  { name: "Jerusalem", country: "Israel", countryCode: "376", lat: 31.7683, lng: 35.2137 },
  { name: "Tel Aviv", country: "Israel", countryCode: "376", lat: 32.0853, lng: 34.7818 },

  // Italy - 380
  { name: "Bologna", country: "Italy", countryCode: "380", lat: 44.4949, lng: 11.3426 },
  { name: "Florence", country: "Italy", countryCode: "380", lat: 43.7696, lng: 11.2558 },
  { name: "Genoa", country: "Italy", countryCode: "380", lat: 44.4056, lng: 8.9463 },
  { name: "Milan", country: "Italy", countryCode: "380", lat: 45.4642, lng: 9.1900 },
  { name: "Naples", country: "Italy", countryCode: "380", lat: 40.8518, lng: 14.2681 },
  { name: "Palermo", country: "Italy", countryCode: "380", lat: 38.1157, lng: 13.3615 },
  { name: "Rome", country: "Italy", countryCode: "380", lat: 41.9028, lng: 12.4964 },
  { name: "Turin", country: "Italy", countryCode: "380", lat: 45.0703, lng: 7.6869 },
  { name: "Venice", country: "Italy", countryCode: "380", lat: 45.4408, lng: 12.3155 },
  { name: "Verona", country: "Italy", countryCode: "380", lat: 45.4384, lng: 10.9916 },

  // Ivory Coast - 384
  { name: "Abidjan", country: "Ivory Coast", countryCode: "384", lat: 5.3600, lng: -4.0083 },
  { name: "Yamoussoukro", country: "Ivory Coast", countryCode: "384", lat: 6.8276, lng: -5.2893 },

  // Jamaica - 388
  { name: "Kingston", country: "Jamaica", countryCode: "388", lat: 18.0179, lng: -76.8099 },
  { name: "Montego Bay", country: "Jamaica", countryCode: "388", lat: 18.4762, lng: -77.8939 },

  // Japan - 392
  { name: "Fukuoka", country: "Japan", countryCode: "392", lat: 33.5904, lng: 130.4017 },
  { name: "Hiroshima", country: "Japan", countryCode: "392", lat: 34.3853, lng: 132.4553 },
  { name: "Kyoto", country: "Japan", countryCode: "392", lat: 35.0116, lng: 135.7681 },
  { name: "Nagoya", country: "Japan", countryCode: "392", lat: 35.1815, lng: 136.9066 },
  { name: "Nara", country: "Japan", countryCode: "392", lat: 34.6851, lng: 135.8048 },
  { name: "Okinawa", country: "Japan", countryCode: "392", lat: 26.3344, lng: 127.8056 },
  { name: "Osaka", country: "Japan", countryCode: "392", lat: 34.6937, lng: 135.5023 },
  { name: "Sapporo", country: "Japan", countryCode: "392", lat: 43.0618, lng: 141.3545 },
  { name: "Tokyo", country: "Japan", countryCode: "392", lat: 35.6762, lng: 139.6503 },
  { name: "Yokohama", country: "Japan", countryCode: "392", lat: 35.4437, lng: 139.6380 },

  // Jordan - 400
  { name: "Amman", country: "Jordan", countryCode: "400", lat: 31.9454, lng: 35.9284 },
  { name: "Aqaba", country: "Jordan", countryCode: "400", lat: 29.5321, lng: 35.0063 },
  { name: "Petra", country: "Jordan", countryCode: "400", lat: 30.3285, lng: 35.4444 },

  // Kazakhstan - 398
  { name: "Almaty", country: "Kazakhstan", countryCode: "398", lat: 43.2220, lng: 76.8512 },
  { name: "Astana", country: "Kazakhstan", countryCode: "398", lat: 51.1694, lng: 71.4491 },

  // Kenya - 404
  { name: "Mombasa", country: "Kenya", countryCode: "404", lat: -4.0435, lng: 39.6682 },
  { name: "Nairobi", country: "Kenya", countryCode: "404", lat: -1.2921, lng: 36.8219 },
  { name: "Nakuru", country: "Kenya", countryCode: "404", lat: -0.3031, lng: 36.0800 },

  // Kiribati - 296
  { name: "Tarawa", country: "Kiribati", countryCode: "296", lat: 1.4518, lng: 172.9717 },

  // Kuwait - 414
  { name: "Kuwait City", country: "Kuwait", countryCode: "414", lat: 29.3759, lng: 47.9774 },

  // Kyrgyzstan - 417
  { name: "Bishkek", country: "Kyrgyzstan", countryCode: "417", lat: 42.8746, lng: 74.5698 },

  // Laos - 418
  { name: "Vientiane", country: "Laos", countryCode: "418", lat: 17.9757, lng: 102.6331 },
  { name: "Luang Prabang", country: "Laos", countryCode: "418", lat: 19.8830, lng: 102.1347 },

  // Latvia - 428
  { name: "Riga", country: "Latvia", countryCode: "428", lat: 56.9496, lng: 24.1052 },

  // Lebanon - 422
  { name: "Beirut", country: "Lebanon", countryCode: "422", lat: 33.8938, lng: 35.5018 },

  // Lesotho - 426
  { name: "Maseru", country: "Lesotho", countryCode: "426", lat: -29.3142, lng: 27.4833 },

  // Liberia - 430
  { name: "Monrovia", country: "Liberia", countryCode: "430", lat: 6.2907, lng: -10.7605 },

  // Libya - 434
  { name: "Tripoli", country: "Libya", countryCode: "434", lat: 32.8872, lng: 13.1913 },
  { name: "Benghazi", country: "Libya", countryCode: "434", lat: 32.1194, lng: 20.0868 },

  // Liechtenstein - 438
  { name: "Vaduz", country: "Liechtenstein", countryCode: "438", lat: 47.1410, lng: 9.5215 },

  // Lithuania - 440
  { name: "Vilnius", country: "Lithuania", countryCode: "440", lat: 54.6872, lng: 25.2797 },
  { name: "Kaunas", country: "Lithuania", countryCode: "440", lat: 54.8985, lng: 23.9036 },

  // Luxembourg - 442
  { name: "Luxembourg City", country: "Luxembourg", countryCode: "442", lat: 49.6116, lng: 6.1319 },

  // Madagascar - 450
  { name: "Antananarivo", country: "Madagascar", countryCode: "450", lat: -18.8792, lng: 47.5079 },

  // Malawi - 454
  { name: "Lilongwe", country: "Malawi", countryCode: "454", lat: -13.9626, lng: 33.7741 },

  // Malaysia - 458
  { name: "George Town", country: "Malaysia", countryCode: "458", lat: 5.4164, lng: 100.3327 },
  { name: "Johor Bahru", country: "Malaysia", countryCode: "458", lat: 1.4927, lng: 103.7414 },
  { name: "Kota Kinabalu", country: "Malaysia", countryCode: "458", lat: 5.9804, lng: 116.0735 },
  { name: "Kuala Lumpur", country: "Malaysia", countryCode: "458", lat: 3.1390, lng: 101.6869 },
  { name: "Langkawi", country: "Malaysia", countryCode: "458", lat: 6.3500, lng: 99.8000 },
  { name: "Malacca", country: "Malaysia", countryCode: "458", lat: 2.1896, lng: 102.2501 },

  // Maldives - 462
  { name: "Male", country: "Maldives", countryCode: "462", lat: 4.1755, lng: 73.5093 },

  // Mali - 466
  { name: "Bamako", country: "Mali", countryCode: "466", lat: 12.6392, lng: -8.0029 },
  { name: "Timbuktu", country: "Mali", countryCode: "466", lat: 16.7735, lng: -3.0074 },

  // Malta - 470
  { name: "Valletta", country: "Malta", countryCode: "470", lat: 35.8989, lng: 14.5146 },

  // Marshall Islands - 584
  { name: "Majuro", country: "Marshall Islands", countryCode: "584", lat: 7.1164, lng: 171.1858 },

  // Mauritania - 478
  { name: "Nouakchott", country: "Mauritania", countryCode: "478", lat: 18.0735, lng: -15.9582 },

  // Mauritius - 480
  { name: "Port Louis", country: "Mauritius", countryCode: "480", lat: -20.1609, lng: 57.5012 },

  // Mexico - 484
  { name: "Cancun", country: "Mexico", countryCode: "484", lat: 21.1619, lng: -86.8515 },
  { name: "Guadalajara", country: "Mexico", countryCode: "484", lat: 20.6597, lng: -103.3496 },
  { name: "Mexico City", country: "Mexico", countryCode: "484", lat: 19.4326, lng: -99.1332 },
  { name: "Monterrey", country: "Mexico", countryCode: "484", lat: 25.6866, lng: -100.3161 },
  { name: "Oaxaca", country: "Mexico", countryCode: "484", lat: 17.0732, lng: -96.7266 },
  { name: "Playa del Carmen", country: "Mexico", countryCode: "484", lat: 20.6296, lng: -87.0739 },
  { name: "Puebla", country: "Mexico", countryCode: "484", lat: 19.0414, lng: -98.2063 },
  { name: "Puerto Vallarta", country: "Mexico", countryCode: "484", lat: 20.6534, lng: -105.2253 },
  { name: "San Miguel de Allende", country: "Mexico", countryCode: "484", lat: 20.9144, lng: -100.7452 },
  { name: "Tijuana", country: "Mexico", countryCode: "484", lat: 32.5149, lng: -117.0382 },

  // Micronesia - 583
  { name: "Palikir", country: "Micronesia", countryCode: "583", lat: 6.9248, lng: 158.1610 },

  // Moldova - 498
  { name: "Chisinau", country: "Moldova", countryCode: "498", lat: 47.0105, lng: 28.8638 },

  // Monaco - 492
  { name: "Monaco", country: "Monaco", countryCode: "492", lat: 43.7384, lng: 7.4246 },

  // Mongolia - 496
  { name: "Ulaanbaatar", country: "Mongolia", countryCode: "496", lat: 47.8864, lng: 106.9057 },

  // Montenegro - 499
  { name: "Podgorica", country: "Montenegro", countryCode: "499", lat: 42.4304, lng: 19.2594 },
  { name: "Kotor", country: "Montenegro", countryCode: "499", lat: 42.4247, lng: 18.7712 },

  // Morocco - 504
  { name: "Casablanca", country: "Morocco", countryCode: "504", lat: 33.5731, lng: -7.5898 },
  { name: "Fez", country: "Morocco", countryCode: "504", lat: 34.0181, lng: -5.0078 },
  { name: "Marrakech", country: "Morocco", countryCode: "504", lat: 31.6295, lng: -7.9811 },
  { name: "Rabat", country: "Morocco", countryCode: "504", lat: 34.0209, lng: -6.8416 },
  { name: "Tangier", country: "Morocco", countryCode: "504", lat: 35.7595, lng: -5.8340 },

  // Mozambique - 508
  { name: "Maputo", country: "Mozambique", countryCode: "508", lat: -25.9692, lng: 32.5732 },

  // Myanmar - 104
  { name: "Mandalay", country: "Myanmar", countryCode: "104", lat: 21.9588, lng: 96.0891 },
  { name: "Naypyidaw", country: "Myanmar", countryCode: "104", lat: 19.7633, lng: 96.0785 },
  { name: "Yangon", country: "Myanmar", countryCode: "104", lat: 16.8661, lng: 96.1951 },

  // Namibia - 516
  { name: "Windhoek", country: "Namibia", countryCode: "516", lat: -22.5609, lng: 17.0658 },

  // Nauru - 520
  { name: "Yaren", country: "Nauru", countryCode: "520", lat: -0.5477, lng: 166.9209 },

  // Nepal - 524
  { name: "Kathmandu", country: "Nepal", countryCode: "524", lat: 27.7172, lng: 85.3240 },
  { name: "Pokhara", country: "Nepal", countryCode: "524", lat: 28.2096, lng: 83.9856 },

  // Netherlands - 528
  { name: "Amsterdam", country: "Netherlands", countryCode: "528", lat: 52.3676, lng: 4.9041 },
  { name: "Eindhoven", country: "Netherlands", countryCode: "528", lat: 51.4416, lng: 5.4697 },
  { name: "Rotterdam", country: "Netherlands", countryCode: "528", lat: 51.9244, lng: 4.4777 },
  { name: "The Hague", country: "Netherlands", countryCode: "528", lat: 52.0705, lng: 4.3007 },
  { name: "Utrecht", country: "Netherlands", countryCode: "528", lat: 52.0907, lng: 5.1214 },

  // New Zealand - 554
  { name: "Auckland", country: "New Zealand", countryCode: "554", lat: -36.8485, lng: 174.7633 },
  { name: "Christchurch", country: "New Zealand", countryCode: "554", lat: -43.5321, lng: 172.6362 },
  { name: "Queenstown", country: "New Zealand", countryCode: "554", lat: -45.0312, lng: 168.6626 },
  { name: "Wellington", country: "New Zealand", countryCode: "554", lat: -41.2865, lng: 174.7762 },

  // Nicaragua - 558
  { name: "Managua", country: "Nicaragua", countryCode: "558", lat: 12.1150, lng: -86.2362 },

  // Niger - 562
  { name: "Niamey", country: "Niger", countryCode: "562", lat: 13.5127, lng: 2.1128 },

  // Nigeria - 566
  { name: "Abuja", country: "Nigeria", countryCode: "566", lat: 9.0765, lng: 7.3986 },
  { name: "Ibadan", country: "Nigeria", countryCode: "566", lat: 7.3775, lng: 3.9470 },
  { name: "Kano", country: "Nigeria", countryCode: "566", lat: 12.0022, lng: 8.5920 },
  { name: "Lagos", country: "Nigeria", countryCode: "566", lat: 6.5244, lng: 3.3792 },
  { name: "Port Harcourt", country: "Nigeria", countryCode: "566", lat: 4.8156, lng: 7.0498 },

  // North Korea - 408
  { name: "Pyongyang", country: "North Korea", countryCode: "408", lat: 39.0392, lng: 125.7625 },

  // North Macedonia - 807
  { name: "Skopje", country: "North Macedonia", countryCode: "807", lat: 41.9973, lng: 21.4280 },

  // Norway - 578
  { name: "Bergen", country: "Norway", countryCode: "578", lat: 60.3913, lng: 5.3221 },
  { name: "Oslo", country: "Norway", countryCode: "578", lat: 59.9139, lng: 10.7522 },
  { name: "Stavanger", country: "Norway", countryCode: "578", lat: 58.9700, lng: 5.7331 },
  { name: "Tromso", country: "Norway", countryCode: "578", lat: 69.6496, lng: 18.9560 },
  { name: "Trondheim", country: "Norway", countryCode: "578", lat: 63.4305, lng: 10.3951 },

  // Oman - 512
  { name: "Muscat", country: "Oman", countryCode: "512", lat: 23.5880, lng: 58.3829 },

  // Pakistan - 586
  { name: "Islamabad", country: "Pakistan", countryCode: "586", lat: 33.6844, lng: 73.0479 },
  { name: "Karachi", country: "Pakistan", countryCode: "586", lat: 24.8607, lng: 67.0011 },
  { name: "Lahore", country: "Pakistan", countryCode: "586", lat: 31.5204, lng: 74.3587 },
  { name: "Peshawar", country: "Pakistan", countryCode: "586", lat: 34.0151, lng: 71.5249 },
  { name: "Faisalabad", country: "Pakistan", countryCode: "586", lat: 31.4187, lng: 73.0791 },

  // Palau - 585
  { name: "Ngerulmud", country: "Palau", countryCode: "585", lat: 7.5006, lng: 134.6242 },

  // Panama - 591
  { name: "Panama City", country: "Panama", countryCode: "591", lat: 8.9824, lng: -79.5199 },

  // Papua New Guinea - 598
  { name: "Port Moresby", country: "Papua New Guinea", countryCode: "598", lat: -6.3149, lng: 143.9556 },

  // Paraguay - 600
  { name: "Asuncion", country: "Paraguay", countryCode: "600", lat: -25.2637, lng: -57.5759 },

  // Peru - 604
  { name: "Arequipa", country: "Peru", countryCode: "604", lat: -16.4090, lng: -71.5375 },
  { name: "Cusco", country: "Peru", countryCode: "604", lat: -13.5320, lng: -71.9675 },
  { name: "Lima", country: "Peru", countryCode: "604", lat: -12.0464, lng: -77.0428 },
  { name: "Trujillo", country: "Peru", countryCode: "604", lat: -8.1116, lng: -79.0287 },

  // Philippines - 608
  { name: "Cebu", country: "Philippines", countryCode: "608", lat: 10.3157, lng: 123.8854 },
  { name: "Davao", country: "Philippines", countryCode: "608", lat: 7.1907, lng: 125.4553 },
  { name: "Manila", country: "Philippines", countryCode: "608", lat: 14.5995, lng: 120.9842 },
  { name: "Quezon City", country: "Philippines", countryCode: "608", lat: 14.6760, lng: 121.0437 },
  { name: "Boracay", country: "Philippines", countryCode: "608", lat: 11.9674, lng: 121.9248 },

  // Poland - 616
  { name: "Cracow", country: "Poland", countryCode: "616", lat: 50.0647, lng: 19.9450 },
  { name: "Gdansk", country: "Poland", countryCode: "616", lat: 54.3520, lng: 18.6466 },
  { name: "Poznan", country: "Poland", countryCode: "616", lat: 52.4064, lng: 16.9252 },
  { name: "Warsaw", country: "Poland", countryCode: "616", lat: 52.2297, lng: 21.0122 },
  { name: "Wroclaw", country: "Poland", countryCode: "616", lat: 51.1079, lng: 17.0385 },

  // Portugal - 620
  { name: "Faro", country: "Portugal", countryCode: "620", lat: 37.0194, lng: -7.9322 },
  { name: "Lisbon", country: "Portugal", countryCode: "620", lat: 38.7223, lng: -9.1393 },
  { name: "Porto", country: "Portugal", countryCode: "620", lat: 41.1579, lng: -8.6291 },

  // Qatar - 634
  { name: "Doha", country: "Qatar", countryCode: "634", lat: 25.2854, lng: 51.5310 },

  // Romania - 642
  { name: "Bucharest", country: "Romania", countryCode: "642", lat: 44.4268, lng: 26.1025 },
  { name: "Cluj-Napoca", country: "Romania", countryCode: "642", lat: 46.7712, lng: 23.6236 },
  { name: "Timisoara", country: "Romania", countryCode: "642", lat: 45.7489, lng: 21.2087 },

  // Russia - 643
  { name: "Kazan", country: "Russia", countryCode: "643", lat: 55.8304, lng: 49.0661 },
  { name: "Moscow", country: "Russia", countryCode: "643", lat: 55.7558, lng: 37.6173 },
  { name: "Novosibirsk", country: "Russia", countryCode: "643", lat: 55.0084, lng: 82.9357 },
  { name: "Saint Petersburg", country: "Russia", countryCode: "643", lat: 59.9343, lng: 30.3351 },
  { name: "Sochi", country: "Russia", countryCode: "643", lat: 43.6028, lng: 39.7342 },
  { name: "Vladivostok", country: "Russia", countryCode: "643", lat: 43.1332, lng: 131.9113 },
  { name: "Yekaterinburg", country: "Russia", countryCode: "643", lat: 56.8389, lng: 60.6057 },
  { name: "Kaliningrad", country: "Russia", countryCode: "643", lat: 54.7104, lng: 20.4522 },

  // Rwanda - 646
  { name: "Kigali", country: "Rwanda", countryCode: "646", lat: -1.9403, lng: 29.8739 },

  // Saint Kitts and Nevis - 659
  { name: "Basseterre", country: "Saint Kitts and Nevis", countryCode: "659", lat: 17.3026, lng: -62.7177 },

  // Saint Lucia - 662
  { name: "Castries", country: "Saint Lucia", countryCode: "662", lat: 14.0101, lng: -60.9870 },

  // Saint Vincent - 670
  { name: "Kingstown", country: "Saint Vincent", countryCode: "670", lat: 13.1587, lng: -61.2248 },

  // Samoa - 882
  { name: "Apia", country: "Samoa", countryCode: "882", lat: -13.8333, lng: -171.7500 },

  // San Marino - 674
  { name: "San Marino", country: "San Marino", countryCode: "674", lat: 43.9424, lng: 12.4578 },

  // Sao Tome and Principe - 678
  { name: "Sao Tome", country: "Sao Tome and Principe", countryCode: "678", lat: 0.1864, lng: 6.6131 },

  // Saudi Arabia - 682
  { name: "Jeddah", country: "Saudi Arabia", countryCode: "682", lat: 21.4858, lng: 39.1925 },
  { name: "Mecca", country: "Saudi Arabia", countryCode: "682", lat: 21.3891, lng: 39.8579 },
  { name: "Medina", country: "Saudi Arabia", countryCode: "682", lat: 24.5247, lng: 39.5692 },
  { name: "Riyadh", country: "Saudi Arabia", countryCode: "682", lat: 24.7136, lng: 46.6753 },
  { name: "Dammam", country: "Saudi Arabia", countryCode: "682", lat: 26.4207, lng: 50.0888 },

  // Senegal - 686
  { name: "Dakar", country: "Senegal", countryCode: "686", lat: 14.7167, lng: -17.4677 },

  // Serbia - 688
  { name: "Belgrade", country: "Serbia", countryCode: "688", lat: 44.7866, lng: 20.4489 },
  { name: "Novi Sad", country: "Serbia", countryCode: "688", lat: 45.2671, lng: 19.8335 },

  // Seychelles - 690
  { name: "Victoria", country: "Seychelles", countryCode: "690", lat: -4.6191, lng: 55.4513 },

  // Sierra Leone - 694
  { name: "Freetown", country: "Sierra Leone", countryCode: "694", lat: 8.4657, lng: -13.2317 },

  // Singapore - 702
  { name: "Singapore", country: "Singapore", countryCode: "702", lat: 1.3521, lng: 103.8198 },

  // Slovakia - 703
  { name: "Bratislava", country: "Slovakia", countryCode: "703", lat: 48.1486, lng: 17.1077 },

  // Slovenia - 705
  { name: "Ljubljana", country: "Slovenia", countryCode: "705", lat: 46.0569, lng: 14.5058 },
  { name: "Bled", country: "Slovenia", countryCode: "705", lat: 46.3684, lng: 14.1146 },

  // Solomon Islands - 090
  { name: "Honiara", country: "Solomon Islands", countryCode: "090", lat: -9.4456, lng: 159.9729 },

  // Somalia - 706
  { name: "Mogadishu", country: "Somalia", countryCode: "706", lat: 2.0469, lng: 45.3182 },

  // South Africa - 710
  { name: "Cape Town", country: "South Africa", countryCode: "710", lat: -33.9249, lng: 18.4241 },
  { name: "Durban", country: "South Africa", countryCode: "710", lat: -29.8587, lng: 31.0218 },
  { name: "Johannesburg", country: "South Africa", countryCode: "710", lat: -26.2041, lng: 28.0473 },
  { name: "Kruger National Park", country: "South Africa", countryCode: "710", lat: -23.9884, lng: 31.5547 },
  { name: "Port Elizabeth", country: "South Africa", countryCode: "710", lat: -33.9608, lng: 25.6022 },
  { name: "Pretoria", country: "South Africa", countryCode: "710", lat: -25.7479, lng: 28.2293 },

  // South Korea - 410
  { name: "Busan", country: "South Korea", countryCode: "410", lat: 35.1796, lng: 129.0756 },
  { name: "Daegu", country: "South Korea", countryCode: "410", lat: 35.8714, lng: 128.6014 },
  { name: "Gwangju", country: "South Korea", countryCode: "410", lat: 35.1595, lng: 126.8526 },
  { name: "Incheon", country: "South Korea", countryCode: "410", lat: 37.4563, lng: 126.7052 },
  { name: "Jeju", country: "South Korea", countryCode: "410", lat: 33.4996, lng: 126.5312 },
  { name: "Seoul", country: "South Korea", countryCode: "410", lat: 37.5665, lng: 126.9780 },

  // South Sudan - 728
  { name: "Juba", country: "South Sudan", countryCode: "728", lat: 4.8594, lng: 31.5713 },

  // Spain - 724
  { name: "Barcelona", country: "Spain", countryCode: "724", lat: 41.3874, lng: 2.1686 },
  { name: "Bilbao", country: "Spain", countryCode: "724", lat: 43.2630, lng: -2.9350 },
  { name: "Granada", country: "Spain", countryCode: "724", lat: 37.1773, lng: -3.5986 },
  { name: "Ibiza", country: "Spain", countryCode: "724", lat: 38.9067, lng: 1.4206 },
  { name: "Madrid", country: "Spain", countryCode: "724", lat: 40.4168, lng: -3.7038 },
  { name: "Malaga", country: "Spain", countryCode: "724", lat: 36.7213, lng: -4.4214 },
  { name: "Palma de Mallorca", country: "Spain", countryCode: "724", lat: 39.5696, lng: 2.6502 },
  { name: "San Sebastian", country: "Spain", countryCode: "724", lat: 43.3183, lng: -1.9812 },
  { name: "Seville", country: "Spain", countryCode: "724", lat: 37.3891, lng: -5.9845 },
  { name: "Valencia", country: "Spain", countryCode: "724", lat: 39.4699, lng: -0.3763 },

  // Sri Lanka - 144
  { name: "Colombo", country: "Sri Lanka", countryCode: "144", lat: 6.9271, lng: 79.8612 },
  { name: "Kandy", country: "Sri Lanka", countryCode: "144", lat: 7.2906, lng: 80.6337 },

  // Sudan - 736
  { name: "Khartoum", country: "Sudan", countryCode: "736", lat: 15.5007, lng: 32.5599 },

  // Suriname - 740
  { name: "Paramaribo", country: "Suriname", countryCode: "740", lat: 5.8520, lng: -55.2038 },

  // Sweden - 752
  { name: "Gothenburg", country: "Sweden", countryCode: "752", lat: 57.7089, lng: 11.9746 },
  { name: "Malmo", country: "Sweden", countryCode: "752", lat: 55.6050, lng: 13.0038 },
  { name: "Stockholm", country: "Sweden", countryCode: "752", lat: 59.3293, lng: 18.0686 },
  { name: "Uppsala", country: "Sweden", countryCode: "752", lat: 59.8586, lng: 17.6389 },

  // Switzerland - 756
  { name: "Basel", country: "Switzerland", countryCode: "756", lat: 47.5596, lng: 7.5886 },
  { name: "Bern", country: "Switzerland", countryCode: "756", lat: 46.9480, lng: 7.4474 },
  { name: "Geneva", country: "Switzerland", countryCode: "756", lat: 46.2044, lng: 6.1432 },
  { name: "Interlaken", country: "Switzerland", countryCode: "756", lat: 46.6863, lng: 7.8632 },
  { name: "Lucerne", country: "Switzerland", countryCode: "756", lat: 47.0502, lng: 8.3093 },
  { name: "Zurich", country: "Switzerland", countryCode: "756", lat: 47.3769, lng: 8.5417 },

  // Syria - 760
  { name: "Aleppo", country: "Syria", countryCode: "760", lat: 36.2021, lng: 37.1343 },
  { name: "Damascus", country: "Syria", countryCode: "760", lat: 33.5138, lng: 36.2765 },

  // Taiwan - 158
  { name: "Kaohsiung", country: "Taiwan", countryCode: "158", lat: 22.6273, lng: 120.3014 },
  { name: "Taipei", country: "Taiwan", countryCode: "158", lat: 25.0330, lng: 121.5654 },
  { name: "Taichung", country: "Taiwan", countryCode: "158", lat: 24.1477, lng: 120.6736 },

  // Tajikistan - 762
  { name: "Dushanbe", country: "Tajikistan", countryCode: "762", lat: 38.5598, lng: 68.7740 },

  // Tanzania - 834
  { name: "Dar es Salaam", country: "Tanzania", countryCode: "834", lat: -6.7924, lng: 39.2083 },
  { name: "Dodoma", country: "Tanzania", countryCode: "834", lat: -6.1630, lng: 35.7516 },
  { name: "Zanzibar City", country: "Tanzania", countryCode: "834", lat: -6.1659, lng: 39.2026 },

  // Thailand - 764
  { name: "Bangkok", country: "Thailand", countryCode: "764", lat: 13.7563, lng: 100.5018 },
  { name: "Chiang Mai", country: "Thailand", countryCode: "764", lat: 18.7061, lng: 98.9817 },
  { name: "Chiang Rai", country: "Thailand", countryCode: "764", lat: 19.9105, lng: 99.8406 },
  { name: "Krabi", country: "Thailand", countryCode: "764", lat: 8.0863, lng: 98.9063 },
  { name: "Pattaya", country: "Thailand", countryCode: "764", lat: 12.9236, lng: 100.8825 },
  { name: "Phuket", country: "Thailand", countryCode: "764", lat: 7.8804, lng: 98.3923 },

  // Timor-Leste - 626
  { name: "Dili", country: "Timor-Leste", countryCode: "626", lat: -8.5569, lng: 125.5603 },

  // Togo - 768
  { name: "Lome", country: "Togo", countryCode: "768", lat: 6.1256, lng: 1.2254 },

  // Tonga - 776
  { name: "Nuku'alofa", country: "Tonga", countryCode: "776", lat: -21.2087, lng: -175.1982 },

  // Trinidad and Tobago - 780
  { name: "Port of Spain", country: "Trinidad and Tobago", countryCode: "780", lat: 10.6596, lng: -61.5086 },

  // Tunisia - 788
  { name: "Tunis", country: "Tunisia", countryCode: "788", lat: 36.8065, lng: 10.1815 },
  { name: "Sousse", country: "Tunisia", countryCode: "788", lat: 35.8288, lng: 10.6405 },

  // Turkey - 792
  { name: "Ankara", country: "Turkey", countryCode: "792", lat: 39.9334, lng: 32.8597 },
  { name: "Antalya", country: "Turkey", countryCode: "792", lat: 36.8969, lng: 30.7133 },
  { name: "Bodrum", country: "Turkey", countryCode: "792", lat: 37.0344, lng: 27.4305 },
  { name: "Cappadocia", country: "Turkey", countryCode: "792", lat: 38.6431, lng: 34.8289 },
  { name: "Ephesus", country: "Turkey", countryCode: "792", lat: 37.9491, lng: 27.3639 },
  { name: "Istanbul", country: "Turkey", countryCode: "792", lat: 41.0082, lng: 28.9784 },
  { name: "Izmir", country: "Turkey", countryCode: "792", lat: 38.4237, lng: 27.1428 },
  { name: "Trabzon", country: "Turkey", countryCode: "792", lat: 41.0027, lng: 39.7168 },

  // Turkmenistan - 795
  { name: "Ashgabat", country: "Turkmenistan", countryCode: "795", lat: 37.9601, lng: 58.3261 },

  // Tuvalu - 798
  { name: "Funafuti", country: "Tuvalu", countryCode: "798", lat: -8.5243, lng: 179.1942 },

  // Uganda - 800
  { name: "Kampala", country: "Uganda", countryCode: "800", lat: 0.3476, lng: 32.5825 },

  // Ukraine - 804
  { name: "Kharkiv", country: "Ukraine", countryCode: "804", lat: 49.9935, lng: 36.2304 },
  { name: "Kyiv", country: "Ukraine", countryCode: "804", lat: 50.4501, lng: 30.5234 },
  { name: "Lviv", country: "Ukraine", countryCode: "804", lat: 49.8397, lng: 24.0297 },
  { name: "Odesa", country: "Ukraine", countryCode: "804", lat: 46.4825, lng: 30.7233 },

  // United Arab Emirates - 784
  { name: "Abu Dhabi", country: "United Arab Emirates", countryCode: "784", lat: 24.4539, lng: 54.3773 },
  { name: "Dubai", country: "United Arab Emirates", countryCode: "784", lat: 25.2048, lng: 55.2708 },
  { name: "Sharjah", country: "United Arab Emirates", countryCode: "784", lat: 25.3463, lng: 55.4209 },

  // United Kingdom - 826
  { name: "Bath", country: "United Kingdom", countryCode: "826", lat: 51.3811, lng: -2.3590 },
  { name: "Belfast", country: "United Kingdom", countryCode: "826", lat: 54.5973, lng: -5.9301 },
  { name: "Birmingham", country: "United Kingdom", countryCode: "826", lat: 52.4862, lng: -1.8904 },
  { name: "Bristol", country: "United Kingdom", countryCode: "826", lat: 51.4545, lng: -2.5879 },
  { name: "Cambridge", country: "United Kingdom", countryCode: "826", lat: 52.2053, lng: 0.1218 },
  { name: "Cardiff", country: "United Kingdom", countryCode: "826", lat: 51.4816, lng: -3.1791 },
  { name: "Edinburgh", country: "United Kingdom", countryCode: "826", lat: 55.9533, lng: -3.1883 },
  { name: "Glasgow", country: "United Kingdom", countryCode: "826", lat: 55.8642, lng: -4.2518 },
  { name: "Leeds", country: "United Kingdom", countryCode: "826", lat: 53.8008, lng: -1.5491 },
  { name: "Liverpool", country: "United Kingdom", countryCode: "826", lat: 53.4084, lng: -2.9916 },
  { name: "London", country: "United Kingdom", countryCode: "826", lat: 51.5074, lng: -0.1278 },
  { name: "Manchester", country: "United Kingdom", countryCode: "826", lat: 53.4808, lng: -2.2426 },
  { name: "Oxford", country: "United Kingdom", countryCode: "826", lat: 51.7520, lng: -1.2577 },
  { name: "York", country: "United Kingdom", countryCode: "826", lat: 53.9600, lng: -1.0873 },

  // United States - 840
  { name: "Anchorage", country: "United States", countryCode: "840", lat: 61.2181, lng: -149.9003 },
  { name: "Atlanta", country: "United States", countryCode: "840", lat: 33.7490, lng: -84.3880 },
  { name: "Austin", country: "United States", countryCode: "840", lat: 30.2672, lng: -97.7431 },
  { name: "Boston", country: "United States", countryCode: "840", lat: 42.3601, lng: -71.0589 },
  { name: "Charleston", country: "United States", countryCode: "840", lat: 32.7765, lng: -79.9311 },
  { name: "Charlotte", country: "United States", countryCode: "840", lat: 35.2271, lng: -80.8431 },
  { name: "Chicago", country: "United States", countryCode: "840", lat: 41.8781, lng: -87.6298 },
  { name: "Dallas", country: "United States", countryCode: "840", lat: 32.7767, lng: -96.7970 },
  { name: "Denver", country: "United States", countryCode: "840", lat: 39.7392, lng: -104.9903 },
  { name: "Detroit", country: "United States", countryCode: "840", lat: 42.3314, lng: -83.0458 },
  { name: "Honolulu", country: "United States", countryCode: "840", lat: 21.3069, lng: -157.8583 },
  { name: "Houston", country: "United States", countryCode: "840", lat: 29.7604, lng: -95.3698 },
  { name: "Indianapolis", country: "United States", countryCode: "840", lat: 39.7684, lng: -86.1581 },
  { name: "Kansas City", country: "United States", countryCode: "840", lat: 39.0997, lng: -94.5786 },
  { name: "Las Vegas", country: "United States", countryCode: "840", lat: 36.1699, lng: -115.1398 },
  { name: "Los Angeles", country: "United States", countryCode: "840", lat: 34.0522, lng: -118.2437 },
  { name: "Memphis", country: "United States", countryCode: "840", lat: 35.1495, lng: -90.0490 },
  { name: "Miami", country: "United States", countryCode: "840", lat: 25.7617, lng: -80.1918 },
  { name: "Milwaukee", country: "United States", countryCode: "840", lat: 43.0389, lng: -87.9065 },
  { name: "Minneapolis", country: "United States", countryCode: "840", lat: 44.9778, lng: -93.2650 },
  { name: "Nashville", country: "United States", countryCode: "840", lat: 36.1627, lng: -86.7816 },
  { name: "New Orleans", country: "United States", countryCode: "840", lat: 29.9511, lng: -90.0715 },
  { name: "New York", country: "United States", countryCode: "840", lat: 40.7128, lng: -74.0060 },
  { name: "Orlando", country: "United States", countryCode: "840", lat: 28.5383, lng: -81.3792 },
  { name: "Philadelphia", country: "United States", countryCode: "840", lat: 39.9526, lng: -75.1652 },
  { name: "Phoenix", country: "United States", countryCode: "840", lat: 33.4484, lng: -112.0740 },
  { name: "Pittsburgh", country: "United States", countryCode: "840", lat: 40.4406, lng: -79.9959 },
  { name: "Portland", country: "United States", countryCode: "840", lat: 45.5152, lng: -122.6784 },
  { name: "Raleigh", country: "United States", countryCode: "840", lat: 35.7796, lng: -78.6382 },
  { name: "Salt Lake City", country: "United States", countryCode: "840", lat: 40.7608, lng: -111.8910 },
  { name: "San Antonio", country: "United States", countryCode: "840", lat: 29.4241, lng: -98.4936 },
  { name: "San Diego", country: "United States", countryCode: "840", lat: 32.7157, lng: -117.1611 },
  { name: "San Francisco", country: "United States", countryCode: "840", lat: 37.7749, lng: -122.4194 },
  { name: "San Jose", country: "United States", countryCode: "840", lat: 37.3382, lng: -121.8863 },
  { name: "Seattle", country: "United States", countryCode: "840", lat: 47.6062, lng: -122.3321 },
  { name: "St. Louis", country: "United States", countryCode: "840", lat: 38.6270, lng: -90.1994 },
  { name: "Tampa", country: "United States", countryCode: "840", lat: 27.9506, lng: -82.4572 },
  { name: "Washington DC", country: "United States", countryCode: "840", lat: 38.9072, lng: -77.0369 },

  // Uruguay - 858
  { name: "Montevideo", country: "Uruguay", countryCode: "858", lat: -34.9011, lng: -56.1645 },
  { name: "Punta del Este", country: "Uruguay", countryCode: "858", lat: -34.9667, lng: -54.9500 },

  // Uzbekistan - 860
  { name: "Bukhara", country: "Uzbekistan", countryCode: "860", lat: 39.7747, lng: 64.4286 },
  { name: "Samarkand", country: "Uzbekistan", countryCode: "860", lat: 39.6542, lng: 66.9597 },
  { name: "Tashkent", country: "Uzbekistan", countryCode: "860", lat: 41.2995, lng: 69.2401 },

  // Vanuatu - 548
  { name: "Port Vila", country: "Vanuatu", countryCode: "548", lat: -17.7334, lng: 168.3273 },

  // Venezuela - 862
  { name: "Caracas", country: "Venezuela", countryCode: "862", lat: 10.4806, lng: -66.9036 },
  { name: "Maracaibo", country: "Venezuela", countryCode: "862", lat: 10.6544, lng: -71.6294 },
  { name: "Valencia", country: "Venezuela", countryCode: "862", lat: 10.1620, lng: -68.0077 },

  // Vietnam - 704
  { name: "Da Nang", country: "Vietnam", countryCode: "704", lat: 16.0544, lng: 108.2022 },
  { name: "Hanoi", country: "Vietnam", countryCode: "704", lat: 21.0278, lng: 105.8342 },
  { name: "Ho Chi Minh City", country: "Vietnam", countryCode: "704", lat: 10.8231, lng: 106.6297 },
  { name: "Hoi An", country: "Vietnam", countryCode: "704", lat: 15.8801, lng: 108.3380 },
  { name: "Hue", country: "Vietnam", countryCode: "704", lat: 16.4637, lng: 107.5909 },
  { name: "Nha Trang", country: "Vietnam", countryCode: "704", lat: 12.2388, lng: 109.1967 },

  // Yemen - 887
  { name: "Sana'a", country: "Yemen", countryCode: "887", lat: 15.3694, lng: 44.1910 },

  // Zambia - 894
  { name: "Lusaka", country: "Zambia", countryCode: "894", lat: -15.3875, lng: 28.3228 },

  // Zimbabwe - 716
  { name: "Harare", country: "Zimbabwe", countryCode: "716", lat: -17.8292, lng: 31.0522 },
  { name: "Victoria Falls", country: "Zimbabwe", countryCode: "716", lat: -17.9243, lng: 25.8572 },
];
