import React from "react";
  import FooterComponent from "../components/FooterComponent";
  import plane from "../assets/images/plane2.jpg";
  import NavigationBarComponent from "../components/NavigationBarComponent";
  import faqs from "../assets/faq";
const FAQ: React.FC = () => {

  return (
    <div className="min-h-screen bg-white">
      <NavigationBarComponent />
      <div className="w-full bg-cover bg-center mb-10 py-12" 
        style={{ 
          backgroundImage: `url(${plane})`,
          position: 'relative'
        }}>
        <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
        <div className="flex justify-between items-center px-8 relative z-10">
          <h1 className="text-2xl font-bold text-white px-10">
            Frequently Asked Questions
          </h1>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="space-y-6 px-20">
          {faqs.map((faq, index) => (
            <div key={index} tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border">
              <div className="collapse-title font-semibold">{faq.question}</div>
              <div className="collapse-content text-sm">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default FAQ; 