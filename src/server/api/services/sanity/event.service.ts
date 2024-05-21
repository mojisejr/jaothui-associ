import { client } from "../../../../../sanity/lib/client";
import { groq } from "next-sanity";
import { Event } from "~/interfaces/sanity/Event";
import { ProfileManagement } from "~/interfaces/sanity/ProfileManagement";

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

export const canEdit = async (wallet: string) => {
  const query = groq`*[_type == "profileManagement" && wallet == "${wallet}"]{wallet, name, isEdited}`;
  const response = await client.fetch<ProfileManagement[]>(query);
  return response.length > 0 && response[0]!.isEdited ? false : true;
};

export const createUserProfileManagement = async (
  wallet: string,
  name: string
) => {
  const query = groq`*[_type == "profileManagement" && wallet == "${wallet}"]{wallet, name, isEdited}`;
  const found = await client.fetch<ProfileManagement[]>(query);
  if (found.length > 0) return;
  const data = {
    _type: "profileManagement",
    _id: wallet,
    wallet,
    name,
    isEdited: true,
  };

  const response = await client.createIfNotExists(data);
  return response;
};
