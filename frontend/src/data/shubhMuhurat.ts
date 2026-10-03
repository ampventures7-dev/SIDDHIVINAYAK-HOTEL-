export interface ShubhMuhurat {
  date: string; // YYYY-MM-DD
  tithiEn: string;
  tithiHi: string;
  nakshatraEn: string;
  nakshatraHi: string;
  auspiciousTimeEn?: string;
  auspiciousTimeHi?: string;
}

export const SHUBH_MUHURAT_LIST: ShubhMuhurat[] = [
  // 2025 Dates
  { date: '2025-01-16', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2025-01-17', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2025-01-18', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2025-01-19', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2025-01-20', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2025-01-21', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2025-01-22', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2025-01-23', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },
  { date: '2025-01-24', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2025-01-26', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },

  { date: '2025-02-02', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2025-02-07', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2025-02-12', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2025-02-13', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2025-02-14', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2025-02-15', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2025-02-18', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2025-02-21', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2025-02-22', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Jyeshtha', nakshatraHi: 'ज्येष्ठा' },
  { date: '2025-02-23', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2025-02-25', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },

  { date: '2025-03-01', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2025-03-02', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2025-03-06', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2025-03-07', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2025-03-12', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },

  { date: '2025-04-14', tithiEn: 'Dvitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2025-04-16', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2025-04-18', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2025-04-19', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Purva Ashadha', nakshatraHi: 'पूर्वाषाढ़ा' },
  { date: '2025-04-20', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2025-04-21', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Shravana', nakshatraHi: 'श्रवण' },
  { date: '2025-04-25', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2025-04-29', tithiEn: 'Dvitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2025-04-30', tithiEn: 'Tritiya', tithiHi: 'तृतीया (अक्षय तृतीया)', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },

  { date: '2025-05-01', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2025-05-05', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2025-05-06', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2025-05-08', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2025-05-09', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2025-05-10', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2025-05-14', tithiEn: 'Dvitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2025-05-15', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2025-05-16', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2025-05-22', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2025-05-23', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2025-05-24', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Ashwini', nakshatraHi: 'अश्विनी' },
  { date: '2025-05-28', tithiEn: 'Dvitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },

  { date: '2025-06-01', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2025-06-02', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2025-06-04', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2025-06-05', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2025-06-07', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2025-06-08', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },

  { date: '2025-11-02', tithiEn: 'Dwadashi (Tulsi Vivah)', tithiHi: 'द्वादशी (तुलसी विवाह)', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2025-11-03', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2025-11-08', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2025-11-12', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2025-11-13', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2025-11-16', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2025-11-17', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2025-11-18', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2025-11-21', tithiEn: 'Dvitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2025-11-22', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Jyeshtha', nakshatraHi: 'ज्येष्ठा' },
  { date: '2025-11-23', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2025-11-25', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2025-11-30', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },

  { date: '2025-12-04', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2025-12-05', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2025-12-06', tithiEn: 'Dvitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },

  // 2026 Dates
  { date: '2026-01-05', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2026-01-09', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2026-01-10', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2026-01-11', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2026-01-12', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2026-01-13', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },
  { date: '2026-01-14', tithiEn: 'Makar Sankranti', tithiHi: 'मकर संक्रांति', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2026-01-25', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2026-01-26', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Ashwini', nakshatraHi: 'अश्विनी' },
  { date: '2026-01-29', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2026-01-30', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },

  { date: '2026-02-05', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2026-02-06', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2026-02-08', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2026-02-10', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2026-02-12', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2026-02-14', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2026-02-19', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2026-02-20', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2026-02-21', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Ashwini', nakshatraHi: 'अश्विनी' },
  { date: '2026-02-24', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2026-02-25', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2026-02-26', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Ardra', nakshatraHi: 'आर्द्रा' },

  { date: '2026-03-01', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2026-03-02', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2026-03-03', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा (होलिका दहन)', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2026-03-04', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2026-03-07', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2026-03-08', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2026-03-09', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },
  { date: '2026-03-11', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Jyeshtha', nakshatraHi: 'ज्येष्ठा' },
  { date: '2026-03-12', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },

  { date: '2026-04-15', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2026-04-18', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Ashwini', nakshatraHi: 'अश्विनी' },
  { date: '2026-04-20', tithiEn: 'Tritiya (Akshaya Tritiya)', tithiHi: 'तृतीया (अक्षय तृतीया - अबूझ मुहूर्त)', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2026-04-21', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2026-04-25', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2026-04-26', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2026-04-27', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2026-04-28', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2026-04-29', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },

  { date: '2026-05-01', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2026-05-03', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2026-05-05', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2026-05-06', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Purva Ashadha', nakshatraHi: 'पूर्वाषाढ़ा' },
  { date: '2026-05-07', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2026-05-08', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Shravana', nakshatraHi: 'श्रवण' },
  { date: '2026-05-11', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Shatabhisha', nakshatraHi: 'शतभिषा' },
  { date: '2026-05-12', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Purva Bhadrapada', nakshatraHi: 'पूर्वा भाद्रपद' },
  { date: '2026-05-13', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2026-05-14', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2026-05-24', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2026-05-25', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2026-05-28', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },

  { date: '2026-06-21', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2026-06-22', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2026-06-23', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2026-06-24', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2026-06-25', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },
  { date: '2026-06-26', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2026-06-27', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Jyeshtha', nakshatraHi: 'ज्येष्ठा' },
  { date: '2026-06-29', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },

  { date: '2026-07-01', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2026-07-02', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Shravana', nakshatraHi: 'श्रवण' },
  { date: '2026-07-03', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Dhanishta', nakshatraHi: 'धनिष्ठा' },
  { date: '2026-07-04', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Shatabhisha', nakshatraHi: 'शतभिषा' },
  { date: '2026-07-06', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2026-07-07', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2026-07-08', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Ashwini', nakshatraHi: 'अश्विनी' },
  { date: '2026-07-09', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Bharani', nakshatraHi: 'भरणी' },
  { date: '2026-07-11', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2026-07-12', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },

  // August & September 2026 Auspicious Muhurats:
  { date: '2026-08-04', tithiEn: 'Saptami', tithiHi: 'सप्तमी (शुभ मुहूर्त)', nakshatraEn: 'Ashwini', nakshatraHi: 'अश्विनी' },
  { date: '2026-08-25', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी (शुभ मुहूर्त)', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2026-09-14', tithiEn: 'Tritiya', tithiHi: 'तृतीया (शुभ लग्न मुहूर्त)', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },

  // October 2026 Auspicious & Abuja Muhurats:
  { date: '2026-10-05', tithiEn: 'Dashami (Shubh Vivah)', tithiHi: 'दशमी (शुभ विवाह मुहूर्त)', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2026-10-14', tithiEn: 'Chaturthi (Karwa Chauth)', tithiHi: 'चतुर्थी (करवा चौथ पर्व)', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2026-10-20', tithiEn: 'Dashami (Vijayadashami Abuja Sawa)', tithiHi: 'दशमी (विजयादशमी - अबूझ सावा)', nakshatraEn: 'Shravana', nakshatraHi: 'श्रवण' },
  { date: '2026-10-24', tithiEn: 'Purnima (Sharad Purnima Maha-Muhurat)', tithiHi: 'पूर्णिमा (शरद पूर्णिमा - महामुहूर्त)', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2026-10-28', tithiEn: 'Trayodashi (Dhanteras Shubh Sawa)', tithiHi: 'त्रयोदशी (धनतेरस शुभ मुहूर्त)', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },

  // Devutthana Ekadashi & Wedding Season Kickoff:
  { date: '2026-11-18', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Shatabhisha', nakshatraHi: 'शतभिषा' },
  { date: '2026-11-20', tithiEn: 'Devutthana Ekadashi', tithiHi: 'देवउठनी एकादशी (अबूझ सावा)', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2026-11-21', tithiEn: 'Dwadashi (Tulsi Vivah)', tithiHi: 'द्वादशी (तुलसी विवाह)', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2026-11-22', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Ashwini', nakshatraHi: 'अश्विनी' },
  { date: '2026-11-24', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2026-11-25', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2026-11-26', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Ardra', nakshatraHi: 'आर्द्रा' },
  { date: '2026-11-28', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },

  { date: '2026-12-01', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2026-12-02', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2026-12-03', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2026-12-04', tithiEn: 'Dashami', tithiHi: 'दशमी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2026-12-05', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2026-12-06', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2026-12-11', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2026-12-12', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2026-12-13', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Purva Ashadha', nakshatraHi: 'पूर्वाषाढ़ा' },

  // 2027 Dates
  { date: '2027-01-15', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2027-01-16', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2027-01-17', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2027-01-21', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2027-01-22', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Jyeshtha', nakshatraHi: 'ज्येष्ठा' },
  { date: '2027-01-23', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2027-01-26', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2027-01-27', tithiEn: 'Chaturthi', tithiHi: 'चतुर्थी', nakshatraEn: 'Shravana', nakshatraHi: 'श्रवण' },
  { date: '2027-01-30', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },

  { date: '2027-02-03', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2027-02-04', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2027-02-07', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2027-02-08', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2027-02-11', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2027-02-12', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2027-02-14', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2027-02-18', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2027-02-19', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Jyeshtha', nakshatraHi: 'ज्येष्ठा' },
  { date: '2027-02-20', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2027-02-21', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Purva Ashadha', nakshatraHi: 'पूर्वाषाढ़ा' },
  { date: '2027-02-24', tithiEn: 'Tritiya', tithiHi: 'तृतीया', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },

  { date: '2027-03-01', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2027-03-02', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2027-03-05', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2027-03-06', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2027-03-07', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2027-03-08', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },

  { date: '2027-04-18', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2027-04-19', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2027-04-20', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2027-04-22', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2027-04-23', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },
  { date: '2027-04-27', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2027-04-28', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Purva Ashadha', nakshatraHi: 'पूर्वाषाढ़ा' },
  { date: '2027-04-29', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },

  { date: '2027-05-02', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Uttara Bhadrapada', nakshatraHi: 'उत्तरा भाद्रपद' },
  { date: '2027-05-03', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Revati', nakshatraHi: 'रेवती' },
  { date: '2027-05-06', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2027-05-07', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2027-05-08', tithiEn: 'Tritiya (Akshaya Tritiya)', tithiHi: 'तृतीया (अक्षय तृतीया - अबूझ सावा)', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2027-05-12', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2027-05-13', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2027-05-14', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2027-05-19', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2027-05-20', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },
  { date: '2027-05-25', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2027-05-26', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Shravana', nakshatraHi: 'श्रवण' },

  { date: '2027-06-10', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2027-06-11', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2027-06-12', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Uttara Phalguni', nakshatraHi: 'उत्तरा फाल्गुनी' },
  { date: '2027-06-15', tithiEn: 'Ekadashi', tithiHi: 'एकादशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2027-06-16', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Vishakha', nakshatraHi: 'विशाखा' },
  { date: '2027-06-17', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },
  { date: '2027-06-20', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Mula', nakshatraHi: 'मूल' },
  { date: '2027-06-21', tithiEn: 'Dwitiya', tithiHi: 'द्वितीया', nakshatraEn: 'Purva Ashadha', nakshatraHi: 'पूर्वाषाढ़ा' },

  { date: '2027-11-19', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Pushya', nakshatraHi: 'पुष्य' },
  { date: '2027-11-20', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Magha', nakshatraHi: 'मघा' },
  { date: '2027-11-21', tithiEn: 'Navami', tithiHi: 'नवमी', nakshatraEn: 'Purva Phalguni', nakshatraHi: 'पूर्वा फाल्गुनी' },
  { date: '2027-11-24', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Hasta', nakshatraHi: 'हस्त' },
  { date: '2027-11-25', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Chitra', nakshatraHi: 'चित्रा' },
  { date: '2027-11-26', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Swati', nakshatraHi: 'स्वाति' },
  { date: '2027-11-28', tithiEn: 'Pratipada', tithiHi: 'प्रतिपदा', nakshatraEn: 'Anuradha', nakshatraHi: 'अनुराधा' },

  { date: '2027-12-02', tithiEn: 'Panchami', tithiHi: 'पंचमी', nakshatraEn: 'Uttara Ashadha', nakshatraHi: 'उत्तराषाढ़ा' },
  { date: '2027-12-03', tithiEn: 'Shashthi', tithiHi: 'षष्ठी', nakshatraEn: 'Shravana', nakshatraHi: 'श्रवण' },
  { date: '2027-12-04', tithiEn: 'Saptami', tithiHi: 'सप्तमी', nakshatraEn: 'Dhanishta', nakshatraHi: 'धनिष्ठा' },
  { date: '2027-12-05', tithiEn: 'Ashtami', tithiHi: 'अष्टमी', nakshatraEn: 'Shatabhisha', nakshatraHi: 'शतभिषा' },
  { date: '2027-12-09', tithiEn: 'Dwadashi', tithiHi: 'द्वादशी', nakshatraEn: 'Rohini', nakshatraHi: 'रोहिणी' },
  { date: '2027-12-10', tithiEn: 'Trayodashi', tithiHi: 'त्रयोदशी', nakshatraEn: 'Mrigashirsha', nakshatraHi: 'मृगशिरा' },
  { date: '2027-12-11', tithiEn: 'Chaturdashi', tithiHi: 'चतुर्दशी', nakshatraEn: 'Ardra', nakshatraHi: 'आर्द्रा' },
  { date: '2027-12-12', tithiEn: 'Purnima', tithiHi: 'पूर्णिमा', nakshatraEn: 'Punarvasu', nakshatraHi: 'पुनर्वसु' },
];

export const SHUBH_MUHURAT_MAP: Record<string, ShubhMuhurat> = SHUBH_MUHURAT_LIST.reduce(
  (acc, item) => {
    acc[item.date] = item;
    return acc;
  },
  {} as Record<string, ShubhMuhurat>
);

export function getShubhMuhurat(dateStr: string): ShubhMuhurat | undefined {
  return SHUBH_MUHURAT_MAP[dateStr];
}

export function isShubhMuhuratDate(dateStr: string): boolean {
  return Boolean(SHUBH_MUHURAT_MAP[dateStr]);
}
