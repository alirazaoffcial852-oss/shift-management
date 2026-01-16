import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t py-6 px-4 sm:px-6 md:px-8 mt-12">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div>
          &copy; {currentYear} All Rights Reserved. Developed by{" "}
          <a
            href="https://hashloops.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Hashloops Technologies
          </a>
        </div>
        <div className="mt-2 sm:mt-0">Version: 0.1.1</div>
      </div>
    </footer>
  );
};

export default Footer;
