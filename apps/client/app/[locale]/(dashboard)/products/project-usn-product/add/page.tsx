import React from "react";
import ProjectUsnProductForm from "../components/ProjectUsnProductForm";
import ProductTabs from "../../add/components/ProductTabs";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <ProductTabs />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ProjectUsnProductForm />
      </div>
    </div>
  );
};

export default page;
