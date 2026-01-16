"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "@workspace/ui/types/user";
import UserService from "@/services/user";
import { toast } from "sonner";
import { IMAGE_URL } from "@/constants/env.constants";

interface ProfileContextType {
  profile: User;
  profileImagePreview: string | null;
  isNewImageUploaded: boolean;
  updateProfile: (formData: FormData) => Promise<void>;
  updateProfileImage: (file: File) => void;
  removeProfileImage: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: {
    name: "",
    email: "",
    image: null,
  },
  profileImagePreview: null,
  isNewImageUploaded: false,
  updateProfile: async () => {},
  updateProfileImage: () => {},
  removeProfileImage: async () => {},
  fetchUserProfile: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<User>({
    name: "",
    email: "",
    image: null,
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [isNewImageUploaded, setIsNewImageUploaded] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await UserService.getUserProfile();
      setProfile({
        name: response.data.name,
        email: response.data.email,
        image: response.data.image || null,
      });
      if (response.data.image) {
        setProfileImagePreview(IMAGE_URL + response.data.image);
        setIsNewImageUploaded(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch profile");
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const response = await UserService.updateProfile(formData);
      await fetchUserProfile();
      toast.success(response?.message);
    } catch (err) {
      toast.error((err as any)?.data?.message || "Failed to update profile");
      throw err;
    }
  };

  const updateProfileImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
      setIsNewImageUploaded(true);
    };
    reader.readAsDataURL(file);
    setProfile((prev) => ({ ...prev, image: file }));
  };

  const removeProfileImage = async () => {
    try {
      const response = await UserService.deleteProfileImage();
      if (response) {
        setProfileImagePreview(null);
        setProfile((prev) => ({ ...prev, image: null }));
        setIsNewImageUploaded(false);
        toast.success("Profile image removed successfully");
      }
    } catch (err) {
      toast.error((err as any)?.data?.message || "Failed to remove image");
      throw err;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profileImagePreview,
        isNewImageUploaded,
        updateProfile,
        updateProfileImage,
        removeProfileImage,
        fetchUserProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
