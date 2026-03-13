const GEO_API_BASE = 'https://bdopenapi.vercel.app/api';

export interface Division {
  id: string;
  name: string;
  bnName: string;
}

export interface District {
  id: string;
  divisionId: string;
  name: string;
  bnName: string;
}

export interface Upazila {
  id: string;
  districtId: string;
  name: string;
  bnName: string;
}

export interface Union {
  id: string;
  upazilaId: string;
  name: string;
  bnName: string;
}

class GeoServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'GeoServiceError';
  }
}

// API returns snake_case — map to camelCase
const mapDivision = (d: any): Division => ({
  id: d.id,
  name: d.name,
  bnName: d.bn_name,
});

const mapDistrict = (d: any): District => ({
  id: d.id,
  divisionId: d.division_id,
  name: d.name,
  bnName: d.bn_name,
});

const mapUpazila = (u: any): Upazila => ({
  id: u.id,
  districtId: u.district_id,
  name: u.name,
  bnName: u.bn_name,
});

const mapUnion = (u: any): Union => ({
  id: u.id,
  upazilaId: u.upazila_id,
  name: u.name,
  bnName: u.bn_name,
});

const geoFetch = async <T>(path: string, mapper: (item: any) => T): Promise<T[]> => {
  let response: Response;

  try {
    response = await fetch(`${GEO_API_BASE}${path}`);
  } catch {
    throw new GeoServiceError(500, 'Network error — could not reach geo API');
  }

  if (!response.ok) {
    throw new GeoServiceError(response.status, `Geo API error: ${response.status} ${response.statusText}`);
  }

  try {
    const json = await response.json();
    // API wraps data in { success, data: [...] }
    const raw = json?.data ?? json;
    return Array.isArray(raw) ? raw.map(mapper) : [];
  } catch {
    throw new GeoServiceError(500, 'Failed to parse geo API response');
  }
};

export const geoService = {
  getAllDivisions: () => geoFetch('/geo/divisions', mapDivision),
  getAllDistricts: () => geoFetch('/geo/districts', mapDistrict),
  getDistrictsByDivision: (divisionId: string) => geoFetch(`/geo/districts/${divisionId}`, mapDistrict),
  getAllUpazilas: () => geoFetch('/geo/upazilas', mapUpazila),
  getUpazilasByDistrict: (districtId: string) => geoFetch(`/geo/upazilas/${districtId}`, mapUpazila),
  getAllUnions: () => geoFetch('/geo/unions', mapUnion),
  getUnionsByUpazila: (upazilaId: string) => geoFetch(`/geo/unions/${upazilaId}`, mapUnion),
};