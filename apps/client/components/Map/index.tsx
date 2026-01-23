import { useState, useRef, useEffect } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Libraries } from "@react-google-maps/api";
import Image from "next/image";
import { getImagePath } from "@/utils/imagePath";

const libraries: Libraries = ["places"];

interface MapWithSearchProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  onPlaceSelect?: (payload: {
    place: google.maps.places.PlaceResult;
    value: string;
  }) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  allowedCountries?: string[];
}

function MapWithSearch({
  label,
  placeholder,
  onChange,
  error,
  value,
  disabled = false,
  required,
  onPlaceSelect,
  allowedCountries,
}: MapWithSearchProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>(value || "");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries,
  });

  useEffect(() => {
    if (!isLoaded) return;

    const style = document.createElement("style");
    style.textContent = `
      .pac-container {
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        font-family: inherit;
        margin-top: 4px;
        padding: 8px 0;
        background-color: white;
        z-index: 9999;
      }
      
      .pac-item {
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
      
      .pac-item:hover, .pac-item-selected {
        background-color: #f7fafc;
      }
      
      .pac-icon {
        margin-right: 12px;
      }
      
      .pac-item-query {
        font-size: 15px;
        color: #2d3748;
        font-weight: 500;
      }
      
      .pac-matched {
        font-weight: 600;
      }
      
      .pac-secondary-matched {
        opacity: 0.7;
      }
      
      .pac-secondary-text {
        color: #718096;
        font-size: 13px;
        margin-top: 2px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isLoaded]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current && inputRef.current) {
      const place = autocompleteRef.current.getPlace();
      const searchBoxValue = inputRef.current.value || "";
      setInputValue(searchBoxValue);
      onChange({ target: { value: searchBoxValue } });
      onPlaceSelect?.({ place, value: searchBoxValue });
    }
  };

  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
    autocomplete.setOptions({
      types: ["geocode", "establishment"],
      fields: ["address_components", "formatted_address", "geometry", "name"],
    });
  };
  const handleInputChange = (e: { target: { value: string } }) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  if (loadError) {
    console.error("Map loading error:", loadError);
    return (
      <div className="search-container">
        <SMSInput
          label={label}
          type="text"
          placeholder={placeholder || "Enter location"}
          onChange={handleInputChange}
          value={inputValue}
          disabled={disabled}
          error={error || "Location search temporarily unavailable"}
          required={required}
        />
      </div>
    );
  }

  return (
    <div className="search-container">
      {isLoaded ? (
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
          options={
            allowedCountries?.length
              ? { componentRestrictions: { country: allowedCountries } }
              : undefined
          }
        >
          <div>
            <SMSInput
              ref={inputRef}
              label={label}
              type="text"
              endIcon={
                <Image
                  src={getImagePath("/images/location.svg")}
                  alt={"alt"}
                  width={18}
                  height={18.73}
                />
              }
              placeholder={placeholder || "Enter location"}
              onChange={handleInputChange}
              value={inputValue}
              disabled={disabled}
              error={error}
              required={required}
            />
          </div>
        </Autocomplete>
      ) : (
        <SMSInput
          label={label}
          type="text"
          placeholder={placeholder || "Enter location"}
          onChange={handleInputChange}
          value={inputValue}
          disabled={true}
          error={error}
          required={required}
        />
      )}
    </div>
  );
}

export default MapWithSearch;
