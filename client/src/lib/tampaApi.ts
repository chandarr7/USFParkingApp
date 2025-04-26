import axios from 'axios';
import { ParkingSpot } from '@/types';

const TAMPA_PARKING_API_URL = 'https://arcgis.tampagov.net/arcgis/rest/services/Parking/TampaParking/FeatureServer/1/query';

interface TampaParkingFeature {
  type: string;
  properties: {
    OBJECTID: number;
    NAME: string;
    ADDRESS: string;
    SPACES?: number;
    RATE?: string;
    LAT?: number;
    LON?: number;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface TampaParkingResponse {
  type: string;
  features: TampaParkingFeature[];
}

/**
 * Fetches parking garages data from Tampa's ArcGIS REST API
 */
export async function getTampaParkingGarages(): Promise<ParkingSpot[]> {
  try {
    const response = await axios.get<TampaParkingResponse>(TAMPA_PARKING_API_URL, {
      params: {
        where: '1=1',
        outFields: '*',
        f: 'geojson'
      }
    });

    return response.data.features.map(feature => {
      // Extract rate as a number if possible
      let price = 0;
      if (feature.properties.RATE) {
        const rateMatch = feature.properties.RATE.match(/\$(\d+(\.\d+)?)/);
        if (rateMatch) {
          price = parseFloat(rateMatch[1]);
        }
      }

      // Get coordinates
      let latitude = 0;
      let longitude = 0;
      
      if (feature.properties.LAT && feature.properties.LON) {
        latitude = feature.properties.LAT;
        longitude = feature.properties.LON;
      } else if (feature.geometry && feature.geometry.coordinates) {
        // GeoJSON format has [longitude, latitude]
        longitude = feature.geometry.coordinates[0];
        latitude = feature.geometry.coordinates[1];
      }

      return {
        id: feature.properties.OBJECTID,
        name: feature.properties.NAME || 'Unknown Garage',
        address: feature.properties.ADDRESS || 'No address provided',
        city: 'Tampa',
        price: price,
        available_spots: feature.properties.SPACES || 0,
        distance: 0, // This would be calculated based on user's location
        rating: 4, // Default rating
        latitude,
        longitude,
        source: 'tampa_api',
        external_id: `tampa_${feature.properties.OBJECTID}`
      };
    });
  } catch (error) {
    console.error('Error fetching Tampa parking data:', error);
    return [];
  }
}