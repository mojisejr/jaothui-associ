import { client } from "../../../../../sanity/lib/client";
import { groq } from "next-sanity";
import { Event } from "~/interfaces/sanity/Event";

export const getAllEvents = async () => {
  const query = groq`*[_type == "event"] {
    isActive,
    "images": images.asset->url,
    _type, 
    name,
    start,
    end,
    _id,
  }`;
  const response = await client.fetch<Event[]>(query);
  return response;
};
