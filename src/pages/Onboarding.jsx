import { Link } from "react-router-dom";
import heroImg from "../assets/images/doctor-patient.jpeg";
import consultImg from "../assets/images/doctor-consult.jpeg";
import aiImg from "../assets/images/ai-health.jpeg";
import logoImg from "../assets/images/LOGO.jpeg";
import backgroundImg from "../assets/images/background.jpeg";

export default function Onboarding() {
  return (
    <div className="font-sans text-slate-900 bg-white relative">
      <div className="relative z-10">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3 font-bold text-xl">
            <img 
              src={logoImg} 
              alt="NovaCare Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-slate-900">NOVA CARE</span>
          </div>
          <nav className="hidden lg:flex gap-8 text-sm font-medium">
            <a href="#home">Home</a>
            <a href="#why">Why NovaCare</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>
          <Link 
            to="/login"
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm hover:bg-slate-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-8 py-24">
          <div>
            <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight">
              The Future of <br /> Predictive Healthcare is Here.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Using Machine Learning to assist early detection and decision making
              in healthcare.
            </p>
            <div className="mt-10 flex gap-4">
              <Link
                to="/login"
                className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-colors inline-block text-center"
              >
                Start Prediction
              </Link>
              <button className="border border-slate-900 px-8 py-3 rounded-full hover:bg-slate-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src={heroImg}
              alt="Doctor and patient"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHY NOVACARE */}
      <section id="why" className="bg-sky-50">
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <h2 className="text-4xl font-bold mb-14">WHY NOVACARE?</h2>
          <div className="grid lg:grid-cols-3 gap-10">
            {[
              {
                title: "Smart Diagnostics",
                text: "AI-powered insights for faster, more accurate health decisions.",
              },
              {
                title: "Holistic Care",
                text: "Treating the whole patient, not just the condition.",
              },
              {
                title: "Real-time Results",
                text: "Instant health analysis when every second truly matters.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-10 rounded-2xl shadow-md text-left"
              >
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="bg-white relative overflow-hidden">
        {/* Leaf background - Top Right */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 -z-0"
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'top right',
            backgroundRepeat: 'no-repeat',
            transform: 'translate(20%, -20%)'
          }}
        />
        <div className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h2 className="text-4xl font-bold mb-6">About Us</h2>
            <h3 className="text-xl font-semibold mb-6">
              Our Mission: Bridging Expertise with Technology
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-xl">
              NovaCare is committed to transforming healthcare through innovative,
              technology-driven solutions. We combine medical expertise with
              advanced digital tools to improve patient outcomes, enhance
              efficiency, and support healthcare professionals in delivering
              accurate and timely care.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg relative z-10">
            <img
              src={consultImg}
              alt="Medical consultation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="bg-emerald-50 relative overflow-hidden">
        {/* Leaf background - Bottom Right */}
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-20 -z-0"
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'bottom right',
            backgroundRepeat: 'no-repeat',
            transform: 'translate(15%, 15%)'
          }}
        />
        <div className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="rounded-3xl overflow-hidden shadow-lg relative z-10">
            <img
              src={aiImg}
              alt="AI healthcare technology"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Technology</h2>
            <p className="text-slate-700 leading-relaxed max-w-xl">
              At NovaCare, technology is at the core of everything we do. Our expert
              team leverages artificial intelligence, data analytics, and secure
              digital systems to develop smart healthcare solutions. We
              continuously improve our platforms to ensure accuracy, privacy,
              and efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-sky-50">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <h2 className="text-4xl font-bold mb-14">Services</h2>
          <div className="space-y-8">
            {[
              {
                title: "Smart Diagnostics",
                text: "Intelligent diagnostic tools that analyze patient data to detect health risks early and support accurate medical decisions.",
              },
              {
                title: "Holistic Care",
                text: "Integrating medical data, lifestyle factors, and continuous monitoring to deliver personalized care.",
              },
              {
                title: "Real-time Results",
                text: "Real-time analysis and instant results, enabling healthcare professionals to act quickly and efficiently.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-white p-10 rounded-2xl shadow-md"
              >
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-600 max-w-3xl">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-900 text-white relative overflow-hidden">
        {/* Leaf background - Bottom Left (behind logo) */}
        <div 
          className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-15 -z-0"
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'bottom left',
            backgroundRepeat: 'no-repeat',
            transform: 'translate(-10%, 10%)'
          }}
        />
        <div className="max-w-7xl mx-auto px-8 py-16 grid lg:grid-cols-3 gap-12 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <img 
                src={logoImg} 
                alt="NovaCare Logo" 
                className="h-12 w-12 object-contain"
              />
              <h4 className="font-bold text-xl">NOVA CARE</h4>
            </div>
            <p className="text-sm text-slate-300 max-w-xs">
              Predictive healthcare powered by artificial intelligence and modern
              medical technology.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Pages</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>Home</li>
              <li>Services</li>
              <li>AI Diagnostics</li>
              <li>About Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Contact</h4>
            <p className="text-sm text-slate-300">Business Inquiries</p>
            <p className="text-sm text-slate-300 mt-2">
              wearenovacare@gmail.com
            </p>
          </div>
        </div>
        <div className="text-center text-xs text-slate-400 pb-6">
          © NovaCare. All rights reserved.
        </div>
      </footer>
      </div>
    </div>
  );
}