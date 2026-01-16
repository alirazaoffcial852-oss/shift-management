"use client";

import React, { useEffect, useRef, useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useTranslations } from "next-intl";
import { Camera, Trash2, Eye, Upload } from "lucide-react";
import { useProfile } from "@/providers/profileProvider";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const {
    profile,
    profileImagePreview,
    isNewImageUploaded,
    updateProfile,
    updateProfileImage,
    removeProfileImage,
    fetchUserProfile,
  } = useProfile();

  const tProfile = useTranslations("common.labels");
  const tSettings = useTranslations("pages.settings");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    setFormData({
      name: profile.name,
      email: profile.email,
    });
  }, [profile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node) &&
        showContextMenu
      ) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContextMenu]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(tSettings("invalidFileTypePleaseUploadJpegPngOrGif"));
        return;
      }

      if (file.size > maxSize) {
        toast.error(tSettings("fileIsTooLargeMaximumSizeIs5MB"));
        return;
      }

      updateProfileImage(file);
      setShowContextMenu(false);
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    if (formData.email) {
      formDataToSend.append("email", formData.email);
    }
    if (profile.image instanceof File) {
      formDataToSend.append("image", profile.image);
    }

    await updateProfile(formDataToSend);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(true);
  };

  const handleViewPhoto = () => {
    const viewableUrl = profileImagePreview;
    if (viewableUrl) {
      window.open(viewableUrl, "_blank");
      setShowContextMenu(false);
    }
  };

  const handleRemoveImage = async () => {
    await removeProfileImage();
    setShowContextMenu(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "";

    const nameParts = name.split(" ");

    return nameParts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">{tProfile("profile")}</h1>
        <p className="text-gray-500 text-sm">
          {tSettings("manageYourProfileInformationAndSettings")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6 relative">
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onContextMenu={handleContextMenu}
          >
            {profileImagePreview ? (
              <div className="relative">
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                {isHovering && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white">
                    <Camera size={24} />
                    <span className="ml-2 text-sm">{tSettings("change")}</span>
                  </div>
                )}

                {/* Context Menu */}
                {showContextMenu && (
                  <div
                    ref={contextMenuRef}
                    className="fixed z-50 bg-white rounded-lg shadow-lg border"
                    style={{
                      top: `${contextMenuPosition.y}px`,
                      left: `${contextMenuPosition.x}px`,
                    }}
                  >
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={handleViewPhoto}
                    >
                      <Eye className="mr-3 w-5 h-5" />
                      {tSettings("viewPhoto")}
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-3 w-5 h-5" />
                      {tSettings("uploadPhoto")}
                    </div>
                    {profileImagePreview && (
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 flex items-center"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className="mr-3 w-5 h-5" />
                        {tSettings("removePhoto")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="w-32 h-32 bg-white rounded-full border-2 border-[#3e8258] shadow flex items-center justify-center relative cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-[#3e8258] text-4xl font-bold">
                  {getInitials(profile.name || "")}
                </span>
                <div className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full">
                  <Camera size={16} />
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4">
          <div className="text-sm font-medium text-gray-700">
            {tProfile("name")}
          </div>
          <div className="md:col-span-2">
            <SMSInput
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              error={errors["name"]}
              name="name"
              placeholder={tSettings("enterYourName")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4">
          <div className="text-sm font-medium text-gray-700">
            {tProfile("email")}
          </div>
          <div className="md:col-span-2">
            <SMSInput
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors["email"]}
              name="email"
              disabled
              placeholder={tSettings("emailAddress")}
              type="email"
            />
          </div>
        </div>

        <div className="py-4 flex justify-end">
          <SMSButton
            text={tSettings("updateProfile")}
            className="text-base text-white"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
