import {images} from '../assets';
import type {Place, PlaceCategoryKey} from '../types/app';

export const placeCategories: Array<{key: PlaceCategoryKey | 'all'; label: string; icon: string}> = [
  {key: 'all', label: 'All', icon: '⭐'},
  {key: 'waterfront', label: 'Waterfront', icon: '🌊'},
  {key: 'parks', label: 'Parks', icon: '🌳'},
  {key: 'landmarks', label: 'Landmarks', icon: '🎭'},
];

export const places: Place[] = [
  {
    id: 'garry-point-park',
    category: 'waterfront',
    name: 'Garry Point Park',
    coordinates: {latitude: 49.1238, longitude: -123.193},
    address: '12011 Seventh Ave, Steveston',
    rating: 4.8,
    distance: '8.9 km',
    image: images.places.garryPoint,
    description:
      "Located at the southwestern tip of Richmond near Steveston Village, Garry Point Park is one of the city's most popular waterfront destinations. Visitors can enjoy panoramic views of the Fraser River, the Gulf Islands, passing fishing boats, wide walking paths, open green spaces, picnic areas, public art, and sunset viewpoints.",
  },
  {
    id: 'west-dyke-trail',
    category: 'waterfront',
    name: 'West Dyke Trail',
    coordinates: {latitude: 49.1705, longitude: -123.202},
    address: 'West Richmond shoreline',
    rating: 4.7,
    distance: '7.1 km',
    image: images.places.westDyke,
    description:
      "The West Dyke Trail is one of Richmond's most scenic waterfront walking and cycling routes. Stretching approximately 6 km between Garry Point Park and Terra Nova Rural Park, the trail follows the shoreline and offers views of Sturgeon Banks, migratory birds, the Strait of Georgia, and the North Shore Mountains.",
  },
  {
    id: 'middle-arm-waterfront-greenway',
    category: 'waterfront',
    name: 'Middle Arm Waterfront Greenway',
    coordinates: {latitude: 49.1818, longitude: -123.1369},
    address: 'Middle Arm, Richmond',
    rating: 4.6,
    distance: '2.9 km',
    image: images.places.middleArm,
    description:
      'This modern waterfront promenade follows the Middle Arm of the Fraser River and features landscaped pathways, public art, observation areas, gardens, and riverfront seating. The greenway is home to the Richmond Olympic Oval area and offers beautiful views of the river and surrounding mountains.',
  },
  {
    id: 'steveston-fishermans-wharf',
    category: 'waterfront',
    name: "Steveston Fisherman's Wharf",
    coordinates: {latitude: 49.1245, longitude: -123.1868},
    address: 'Bayview St, Steveston',
    rating: 4.9,
    distance: '8.4 km',
    image: images.places.stevestonWharf,
    description:
      "A vibrant waterfront boardwalk where visitors can watch fishing vessels arrive with fresh seafood. The wharf is surrounded by restaurants, shops, and marina facilities, creating a lively coastal atmosphere that reflects Richmond's historic fishing heritage.",
  },
  {
    id: 'imperial-landing-park',
    category: 'waterfront',
    name: 'Imperial Landing Park',
    coordinates: {latitude: 49.1241, longitude: -123.1843},
    address: 'Steveston Harbour',
    rating: 4.7,
    distance: '8.2 km',
    image: images.places.imperialLanding,
    description:
      'This waterfront park connects Steveston Village with nearby heritage attractions. Visitors can enjoy riverfront pathways, an observation tower, historic fishing industry exhibits, public docks, and excellent views of the Fraser River and Steveston Harbour.',
  },
  {
    id: 'london-wharf-park',
    category: 'waterfront',
    name: 'London Wharf Park',
    coordinates: {latitude: 49.138, longitude: -123.1787},
    address: 'Dyke Rd, Richmond',
    rating: 4.5,
    distance: '6.7 km',
    image: images.places.londonWharf,
    description:
      "Situated along the Fraser River, London Wharf Park offers expansive waterfront views, a large pier, walking trails, picnic areas, public art installations, and connections to Richmond's extensive dyke trail system. It is a peaceful location for relaxing walks beside the river.",
  },
  {
    id: 'terra-nova-rural-park',
    category: 'parks',
    name: 'Terra Nova Rural Park',
    coordinates: {latitude: 49.1786, longitude: -123.1915},
    address: '2631 Westminster Hwy',
    rating: 4.8,
    distance: '6.6 km',
    image: images.places.terraNova,
    description:
      "Terra Nova Rural Park is one of Richmond's largest green spaces, featuring scenic walking trails, community gardens, picnic areas, natural wetlands, and open meadows. Visitors can enjoy peaceful walks while observing local wildlife and beautiful views of the Fraser River and surrounding mountains.",
  },
  {
    id: 'iona-beach-regional-park',
    category: 'parks',
    name: 'Iona Beach Regional Park',
    coordinates: {latitude: 49.2228, longitude: -123.2094},
    address: '900 Ferguson Rd',
    rating: 4.7,
    distance: '11.2 km',
    image: images.places.ionaBeach,
    description:
      'Located near the mouth of the Fraser River, Iona Beach Regional Park offers wide sandy beaches, birdwatching opportunities, cycling routes, and spectacular ocean views. The park is especially popular for sunset walks and wildlife photography thanks to its diverse coastal ecosystem.',
  },
  {
    id: 'richmond-nature-park',
    category: 'parks',
    name: 'Richmond Nature Park',
    coordinates: {latitude: 49.1704, longitude: -123.0917},
    address: '11851 Westminster Hwy',
    rating: 4.6,
    distance: '5.4 km',
    image: images.places.richmondNature,
    description:
      "This protected natural area preserves one of the last remaining peat bog habitats in the region. Visitors can explore forest trails, educational exhibits, wooden boardwalks, and wildlife observation areas while learning about Richmond's unique ecosystem.",
  },
  {
    id: 'king-george-cambie-community-park',
    category: 'parks',
    name: 'King George/Cambie Community Park',
    coordinates: {latitude: 49.176, longitude: -123.1264},
    address: '4100 No. 5 Rd',
    rating: 4.4,
    distance: '3.5 km',
    image: images.places.kingGeorgeCambie,
    description:
      'A spacious urban park featuring landscaped gardens, sports facilities, walking paths, picnic shelters, and large green spaces. The park is ideal for families looking to relax outdoors while enjoying nature within the city.',
  },
  {
    id: 'garden-city-lands',
    category: 'parks',
    name: 'Garden City Lands',
    coordinates: {latitude: 49.1679, longitude: -123.1237},
    address: 'Garden City Rd, Richmond',
    rating: 4.6,
    distance: '4.1 km',
    image: images.places.gardenCity,
    description:
      'Garden City Lands is a large urban nature reserve with extensive walking trails, wetlands, grasslands, and wildlife habitats. The area provides a peaceful escape from city life while offering excellent opportunities for birdwatching and outdoor recreation.',
  },
  {
    id: 'south-dyke-trail',
    category: 'parks',
    name: 'South Dyke Trail',
    coordinates: {latitude: 49.1449, longitude: -123.1707},
    address: 'South Richmond shoreline',
    rating: 4.5,
    distance: '6.1 km',
    image: images.places.southDyke,
    description:
      'Following the southern edge of Richmond along the Fraser River, the South Dyke Trail offers beautiful waterfront scenery, open natural landscapes, and long walking and cycling routes. Visitors can enjoy fresh air, river views, and frequent wildlife sightings throughout the year.',
  },
  {
    id: 'gulf-of-georgia-cannery',
    category: 'landmarks',
    name: 'Gulf of Georgia Cannery National Historic Site',
    coordinates: {latitude: 49.1248, longitude: -123.1875},
    address: '12138 Fourth Ave',
    rating: 4.6,
    distance: '8.5 km',
    image: images.places.cannery,
    description:
      "One of Richmond's most important historic landmarks, the Gulf of Georgia Cannery preserves the city's fishing heritage. Visitors can explore interactive exhibits, historic machinery, educational displays, and learn how the fishing industry helped shape the development of British Columbia's west coast.",
  },
  {
    id: 'britannia-shipyards',
    category: 'landmarks',
    name: 'Britannia Shipyards National Historic Site',
    coordinates: {latitude: 49.1477, longitude: -123.1703},
    address: '5180 Westwater Dr',
    rating: 4.7,
    distance: '6.0 km',
    image: images.places.britannia,
    description:
      "This well-preserved waterfront heritage site highlights Richmond's multicultural fishing history. The area features restored buildings, historic homes, boatyards, exhibits, and guided tours that provide insight into the lives of early fishing communities along the Fraser River.",
  },
  {
    id: 'richmond-olympic-oval',
    category: 'landmarks',
    name: 'Richmond Olympic Oval',
    coordinates: {latitude: 49.1775, longitude: -123.1448},
    address: '6111 River Rd',
    rating: 4.6,
    distance: '2.8 km',
    image: images.places.oval,
    description:
      "Built for the 2010 Winter Olympics, the Richmond Olympic Oval has become one of Canada's premier sports and community facilities. Visitors can admire its modern architecture, Olympic exhibits, public art installations, and enjoy the scenic waterfront surroundings.",
  },
  {
    id: 'steveston-village',
    category: 'landmarks',
    name: 'Steveston Village',
    coordinates: {latitude: 49.1242, longitude: -123.1848},
    address: 'Steveston Village',
    rating: 4.9,
    distance: '8.3 km',
    image: images.places.stevestonVillage,
    description:
      "Steveston Village is a charming historic district known for its fishing heritage, waterfront boardwalks, local shops, restaurants, and cultural attractions. The area combines historic character with a lively atmosphere and remains one of Richmond's most visited destinations.",
  },
  {
    id: 'richmond-museum',
    category: 'landmarks',
    name: 'Richmond Museum',
    coordinates: {latitude: 49.1666, longitude: -123.1336},
    address: '7700 Minoru Gate',
    rating: 4.5,
    distance: '3.7 km',
    image: images.places.museum,
    description:
      "Located within the Richmond Cultural Centre, the Richmond Museum presents engaging exhibits that tell the story of the city's development, communities, industries, and cultural diversity. Interactive displays make it a popular destination for visitors of all ages.",
  },
  {
    id: 'richmond-cultural-centre',
    category: 'landmarks',
    name: 'Richmond Cultural Centre',
    coordinates: {latitude: 49.1664, longitude: -123.1331},
    address: '7700 Minoru Gate',
    rating: 4.5,
    distance: '3.8 km',
    image: images.places.culturalCentre,
    description:
      "The Richmond Cultural Centre serves as the city's primary hub for arts, culture, and education. The complex includes galleries, performance spaces, public art displays, workshops, and cultural events that celebrate Richmond's diverse community and artistic talent.",
  },
];

export function getPlaceById(id: string): Place | undefined {
  return places.find(place => place.id === id);
}
