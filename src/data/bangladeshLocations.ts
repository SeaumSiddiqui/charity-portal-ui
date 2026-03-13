export interface Union {
  name: string;
}

export interface SubDistrict {
  name: string;
  unions: Union[];
}

export interface District {
  name: string;
  subDistricts: SubDistrict[];
}

export const bangladeshLocations: District[] = [
  {
    name: "ঢাকা",
    subDistricts: [
      {
        name: "ধামরাই",
        unions: [
          { name: "আমতা" },
          { name: "বাইশাকান্দা" },
          { name: "চারিগাঁও" },
          { name: "ধামরাই" },
          { name: "কুল্লা" },
        ]
      },
      {
        name: "দোহার",
        unions: [
          { name: "বিলাসপুর" },
          { name: "কুসুমহাটি" },
          { name: "মাহমুদপুর" },
          { name: "নয়াবাড়ী" },
          { name: "সুতারপাড়া" },
        ]
      },
      {
        name: "কেরানীগঞ্জ",
        unions: [
          { name: "আগানগর" },
          { name: "বাড়ড়া" },
          { name: "কালাটিয়া" },
          { name: "রুহিতপুর" },
          { name: "তেঘরিয়া" },
        ]
      },
      {
        name: "নবাবগঞ্জ",
        unions: [
          { name: "বান্দুরা" },
          { name: "কালিন্দী" },
          { name: "নবাবগঞ্জ" },
          { name: "শিমুলিয়া" },
          { name: "সুলতানগঞ্জ" },
        ]
      },
      {
        name: "সাভার",
        unions: [
          { name: "আমিন বাজার" },
          { name: "আশুলিয়া" },
          { name: "বিরুলিয়া" },
          { name: "কাউন্দিয়া" },
          { name: "ইয়ারপুর" },
        ]
      },
    ]
  },
  {
    name: "চট্টগ্রাম",
    subDistricts: [
      {
        name: "আনোয়ারা",
        unions: [
          { name: "আনোয়ারা" },
          { name: "বটতলী" },
          { name: "বুড়ুমচড়া" },
          { name: "চাতারী" },
          { name: "হাইলধর" },
        ]
      },
      {
        name: "বাঁশখালী",
        unions: [
          { name: "বাহারছড়া" },
          { name: "বাঁশখালী" },
          { name: "চাম্বল" },
          { name: "গণ্ডামারা" },
          { name: "কাদলপুর" },
        ]
      },
      {
        name: "চন্দনাইশ",
        unions: [
          { name: "বড়উঠান" },
          { name: "দোহাজারী" },
          { name: "হাশিমপুর" },
          { name: "জোয়ারা" },
          { name: "কাঞ্চনাবাদ" },
        ]
      },
      {
        name: "ফটিকছড়ি",
        unions: [
          { name: "ভান্ডারিকান্দি" },
          { name: "ধর্মপুর" },
          { name: "নারায়ণহাট" },
          { name: "রোসাংগিরি" },
          { name: "সুয়াবিল" },
        ]
      },
      {
        name: "হাটহাজারী",
        unions: [
          { name: "বাকালিয়া" },
          { name: "ফতেহাবাদ" },
          { name: "গড়দুয়ারা" },
          { name: "কাটিরহাট" },
          { name: "মাদার্সা" },
        ]
      },
    ]
  },
  {
    name: "সিলেট",
    subDistricts: [
      {
        name: "বালাগঞ্জ",
        unions: [
          { name: "বোয়ালজুর" },
          { name: "বুরহানপুর" },
          { name: "দেওয়ান বাজার" },
          { name: "ওসমানী নগর" },
          { name: "পশ্চিম গৌরীপুর" },
        ]
      },
      {
        name: "বিয়ানীবাজার",
        unions: [
          { name: "আলোকদিয়া" },
          { name: "দুবাগ" },
          { name: "কুড়ার বাজার" },
          { name: "লাউতা" },
          { name: "মাথিউরা" },
        ]
      },
      {
        name: "বিশ্বনাথ",
        unions: [
          { name: "আলংকারি" },
          { name: "দৌলতপুর" },
          { name: "দশঘর" },
          { name: "লামা কাজী" },
          { name: "রামপাশা" },
        ]
      },
      {
        name: "কোম্পানীগঞ্জ",
        unions: [
          { name: "ইছামতি" },
          { name: "ইসলামপুর পূর্ব" },
          { name: "মোগলা বাজার" },
          { name: "রানীগঞ্জ" },
          { name: "তেলিখাল" },
        ]
      },
      {
        name: "ফেঞ্চুগঞ্জ",
        unions: [
          { name: "ফেঞ্চুগঞ্জ" },
          { name: "গিলাছড়া" },
          { name: "মাইজগাঁও" },
          { name: "মোগলাবাদ" },
          { name: "পশ্চিম গৌরীপুর" },
        ]
      },
    ]
  },
  {
    name: "রাজশাহী",
    subDistricts: [
      {
        name: "বাঘা",
        unions: [
          { name: "আড়ানী" },
          { name: "বাজুবাঘা" },
          { name: "গড়গড়ি" },
          { name: "পাকুড়িয়া" },
          { name: "মনিগ্রাম" },
        ]
      },
      {
        name: "বাগমারা",
        unions: [
          { name: "আউচপাড়া" },
          { name: "বাগমারা" },
          { name: "বাউসা" },
          { name: "গানীপুর" },
          { name: "পাংশা" },
        ]
      },
      {
        name: "চারঘাট",
        unions: [
          { name: "চর আশারিয়াদহ" },
          { name: "নিমপাড়া" },
          { name: "শালগাড়িয়া" },
          { name: "সরদহ" },
          { name: "ভায়ালক্ষ্মীপুর" },
        ]
      },
      {
        name: "দুর্গাপুর",
        unions: [
          { name: "দেওপাড়া" },
          { name: "গোবিন্দপাড়া" },
          { name: "জোয়ারী" },
          { name: "পাঁচন্দর" },
          { name: "শ্যওপুর" },
        ]
      },
      {
        name: "গোদাগাড়ী",
        unions: [
          { name: "আশারিয়াদহ" },
          { name: "গোগ্রাম" },
          { name: "মাটিকাটা" },
          { name: "মোহনপুর" },
          { name: "পাকড়ী" },
        ]
      },
    ]
  },
  {
    name: "খুলনা",
    subDistricts: [
      {
        name: "বটিয়াঘাটা",
        unions: [
          { name: "বটিয়াঘাটা" },
          { name: "ভান্ডারকোট" },
          { name: "গঙ্গারামপুর" },
          { name: "জলমা" },
          { name: "সুরখালী" },
        ]
      },
      {
        name: "ডাকোপ",
        unions: [
          { name: "বাজুয়া" },
          { name: "বানিশান্তা" },
          { name: "কামারখোলা" },
          { name: "লাউডোবা" },
          { name: "পানখালী" },
        ]
      },
      {
        name: "ডুমুরিয়া",
        unions: [
          { name: "আটরা গিলাতলা" },
          { name: "ধামালিয়া" },
          { name: "খর্ণিয়া" },
          { name: "মাগুরঘোনা" },
          { name: "সাহস" },
        ]
      },
      {
        name: "কয়রা",
        unions: [
          { name: "আমাদি" },
          { name: "বাগালী" },
          { name: "কয়রা" },
          { name: "মহারাজপুর" },
          { name: "উত্তর বেদকাশী" },
        ]
      },
      {
        name: "পাইকগাছা",
        unions: [
          { name: "চাঁদখালী" },
          { name: "গদাইপুর" },
          { name: "কপিলমুনি" },
          { name: "লক্ষ্মীপুর" },
          { name: "সোলাদানা" },
        ]
      },
    ]
  },
];

export const getDistricts = (): District[] => {
  return bangladeshLocations;
};

export const getSubDistricts = (districtName: string): SubDistrict[] => {
  const district = bangladeshLocations.find(d => d.name === districtName);
  return district?.subDistricts || [];
};

export const getUnions = (districtName: string, subDistrictName: string): Union[] => {
  const district = bangladeshLocations.find(d => d.name === districtName);
  const subDistrict = district?.subDistricts.find(sd => sd.name === subDistrictName);
  return subDistrict?.unions || [];
};
