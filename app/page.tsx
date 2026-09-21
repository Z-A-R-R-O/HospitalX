import Link from "next/link";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Search, Play, ArrowRight, Download, CheckCircle2 } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { LandingHeader } from "./landing-header";
import { HeroScrollVideo } from "./hero-scroll-video";
import "./landing.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function LandingPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="landing-page">
      <LandingHeader clerkEnabled={clerkEnabled} />

      <div className="hero-wrapper">
        <section className="hero-section">
          <HeroScrollVideo />
        
        <div className="hero-content">
          <div className="hero-left">
            <span className="eyebrow">HOSPITALX</span>
            <h1 className={playfair.className}>Care<br/>Flows<br/>Further.</h1>
            <p className="hero-desc">
              HospitalX, a Veyminore product, is the next-generation<br/>
              hospital management software — unifying people,<br/>
              processes, and patient care for a healthier tomorrow.
            </p>
            <div className="hero-ctas">
              <Link href="/dashboard" className="btn btn-black btn-large">
                <svg width="18" height="18" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 12.4L35.6 7.4V41.6H0V12.4ZM40.8 6.6L88 0V40.8H40.8V6.6ZM0 46.2H35.6V80.4L0 75.4V46.2ZM40.8 46.2H88V88L40.8 81.2V46.2Z" fill="currentColor"/>
                </svg> Download for Windows <Download size={16} />
              </Link>
              <button className="btn btn-outline btn-large">
                <Play size={18} /> Watch Film
              </button>
            </div>
            
            <div className="trusted-by">
              <div className="avatars">
                <div className="avatar a1"></div>
                <div className="avatar a2"></div>
                <div className="avatar a3"></div>
                <div className="avatar a4"></div>
              </div>
              <span>Trusted by 500+ hospitals<br/>across India</span>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="dashboard-mockup glass-panel">
              {/* Glass UI Mockup */}
              <div className="mockup-body">
                <div className="mockup-sidebar">
                  <ul>
                    <li className="active">Dashboard</li>
                    <li>Patients</li>
                    <li>Appointments</li>
                    <li>OPD / IPD</li>
                    <li>Pharmacy</li>
                    <li>Laboratory</li>
                  </ul>
                </div>
                <div className="mockup-main">
                  <h2>Good morning,<br/>Let's keep care moving.</h2>
                  <div className="mockup-stats">
                    <div className="stat-card">
                      <small>Patients Today</small>
                      <strong>482</strong>
                      <span className="green">↑ 12%</span>
                    </div>
                    <div className="stat-card">
                      <small>OPD</small>
                      <strong>320</strong>
                      <span className="green">↑ 8%</span>
                    </div>
                    <div className="stat-card">
                      <small>IPD</small>
                      <strong>118</strong>
                      <span className="green">↑ 4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-indicator">
              <ul>
                <li className="active">01</li>
                <li>02</li>
                <li>03</li>
              </ul>
            </div>
            <div className="vertical-text scroll-text">SCROLL</div>
            <div className="vertical-text right-text">A VEYMINORE PRODUCT</div>
          </div>
        </div>
      </section>
      </div>

      <section className="value-section">
        <div className="value-header">
          <div className="value-title">
            <span className="eyebrow">BUILT FOR REAL IMPACT</span>
            <h2 className={playfair.className}>Smarter<br/>Hospitals.<br/>Happier People.</h2>
          </div>
          <div className="value-desc">
            <p>Complete hospital operations, in<br/>one intelligent platform. Designed<br/>for the real world, built for what's next.</p>
            <Link href="#" className="btn-text">Explore Solutions <ArrowRight size={16} /></Link>
          </div>
        </div>
        
        <div className="features-row">
          {[
            "Patient Management",
            "Clinical Workflows",
            "Pharmacy & Inventory",
            "Laboratory Management",
            "Billing & Insurance",
            "Analytics & Insights"
          ].map((feature, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-icon glass-icon">
                <div className="glass-cube"></div>
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="intelligence-section">
        <div className="dark-bg">
          <Image src="/dark_bg.jpg" alt="Dark Mountain Background" fill className="bg-img" />
        </div>
        
        <div className="intelligence-content">
          <div className="intel-left">
            <span className="eyebrow">INTELLIGENCE IN ACTION</span>
            <h2 className={playfair.className}>From Data<br/>to Better Decisions.</h2>
            <p>
              Turn everyday hospital data into meaningful insights.<br/>
              Make faster, smarter, and more human decisions<br/>
              with HospitalX.
            </p>
            <Link href="#" className="btn btn-outline-light">See It In Action <ArrowRight size={16} /></Link>
          </div>
          
          <div className="intel-center">
            <div className="glass-sphere-wrapper">
               <Image src="/sphere.jpg" alt="Glass Sphere" fill className="sphere-img" />
               <div className="sphere-logo">H</div>
            </div>
          </div>
          
          <div className="intel-right">
            <div className="vertical-text-right">TECHNOLOGY THAT UNDERSTANDS PEOPLE.</div>
            <div className="metrics-list">
              <div className="metric">
                <strong>500+</strong>
                <span>Hospitals</span>
              </div>
              <div className="metric">
                <strong>2M+</strong>
                <span>Patients Managed</span>
              </div>
              <div className="metric">
                <strong>99.9%</strong>
                <span>Uptime</span>
              </div>
              <div className="metric">
                <strong>40%</strong>
                <span>Faster Workflows</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="download-section">
        <div className="hero-bg opacity-70">
          <Image src="/hero_bg.jpg" alt="Bright Background" fill className="bg-img" />
        </div>
        
        <div className="download-content">
          <div className="dl-left">
            <span className="eyebrow">AVAILABLE EVERYWHERE</span>
            <h2 className={playfair.className}>Download<br/>HospitalX</h2>
            <p>Join hospitals already building a better tomorrow.</p>
            
            <div className="platform-cards">
              <div className="platform-card">
                <div className="plat-icon">
                  <svg width="24" height="24" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 12.4L35.6 7.4V41.6H0V12.4ZM40.8 6.6L88 0V40.8H40.8V6.6ZM0 46.2H35.6V80.4L0 75.4V46.2ZM40.8 46.2H88V88L40.8 81.2V46.2Z" fill="currentColor"/>
                  </svg>
                </div>
                <strong>Windows</strong>
                <small>v1.0.0 | Free</small>
              </div>
              <div className="platform-card disabled">
                <div className="plat-icon">
                  <svg width="24" height="24" viewBox="0 0 384 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 273.5q-9 50.6 11.7 104c10 25.5 25.3 53.3 50.8 55.4 24.3 2 32.3-12.7 61-12.7 28.5 0 36.2 12.9 61 12.5 25.3-.4 38.3-25.5 48.7-50 11.2-26.6 15.6-36.6 16.2-37.4-1.7-1-49.5-19.3-50.7-76.6zM224 93.3c15.2-18.3 25.5-41.5 22.7-65.3-20.2 1-45.7 13.9-61.6 32-13.8 15.7-25.5 39.5-22.1 62.7 22.6 1.7 45.4-10.7 61-29.4z" fill="currentColor"/>
                  </svg>
                </div>
                <strong>macOS</strong>
                <small>Coming Soon</small>
              </div>
              <div className="platform-card disabled">
                <div className="plat-icon">
                  <svg width="24" height="24" viewBox="0 0 576 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M420.22 165.73l43.2-74.83a8.9 8.9 0 00-3.26-12.16 8.87 8.87 0 00-12.11 3.3L404.14 158.1a281.87 281.87 0 00-116.14-25.1c-40.45 0-78.53 9-116.14 25.1l-43.9-76a8.88 8.88 0 00-12.14-3.3 8.9 8.9 0 00-3.26 12.15l43.2 74.83C66.52 216.71 0 315.62 0 432h576c0-116.38-66.52-215.29-155.78-266.27zM168 352a32 32 0 1132-32 32 32 0 01-32 32zm240 0a32 32 0 1132-32 32 32 0 01-32 32z" fill="currentColor"/>
                  </svg>
                </div>
                <strong>Android</strong>
                <small>Coming Soon</small>
              </div>
            </div>
            
            <div className="dl-features">
              <span><CheckCircle2 size={14}/> No credit card required</span>
              <span><CheckCircle2 size={14}/> Free for educational use</span>
              <span><CheckCircle2 size={14}/> Regular updates</span>
            </div>
          </div>
          
          <div className="dl-right">
             <div className="laptop-mockup glass-panel">
                <div className="laptop-screen">
                   <div className="mockup-logo-large">H</div>
                   <h3>HospitalX</h3>
                   <p>Care. Simplified.</p>
                   <small>A Veyminore Product</small>
                </div>
             </div>
             <div className="vertical-text-right">INSTALL. INNOVATE. IMPACT.</div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-left">
          <span className="veyminore-logo">Veyminore</span>
          <span className="copyright">© 2026 Veyminore. All rights reserved.</span>
        </div>
        <div className="footer-center">
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Contact</Link>
          <div className="socials">
             <span>X</span>
             <span>in</span>
             <span>YT</span>
          </div>
        </div>
        <div className="footer-right">
          A HEALTHIER<br/>TOMORROW.
        </div>
      </footer>
    </div>
  );
}
