import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-800 py-4">
      <div className="container mx-auto flex flex-col items-center text-center px-6">
        <div className="w-full flex justify-between items-center mb-4">
          <span className="text-3xl text-white font-bold">Hotelio.com</span>
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/in/saketh-yamsani-5a89ba257" target="_blank" rel="noopener noreferrer" className="text-white">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="https://github.com/Saketh-Yamsani" target="_blank" rel="noopener noreferrer" className="text-white">
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
            <a href="https://www.instagram.com/saketh_yamsani" target="_blank" rel="noopener noreferrer" className="text-white">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
          </div>
          <div className="flex gap-4 text-white font-bold">
            <p className="cursor-pointer">Privacy Policy</p>
            <p className="cursor-pointer">Terms of Service</p>
          </div>
        </div>
        <p className="text-white">Copyright © Saketh Yamsani, All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;