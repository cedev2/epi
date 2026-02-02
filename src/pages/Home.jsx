import './Home.css';
import bgImage from '../assets/bg.jpg';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section
                className="hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(13, 51, 93, 0.9), rgba(13, 51, 93, 0.7)), url(${bgImage})`
                }}
            >
                <div className="container hero-content">
                    <h1>Nurturing the Leaders of Tomorrow</h1>
                    <p>Ecole Primary Intwali (EP INTWALI) provides high-quality primary education to prepare children for a successful future.</p>
                    <div className="hero-btns">
                        <a href="/staff" className="btn btn-primary">Our Staff</a>
                        <a href="/about" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Learn More</a>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="intro section-padding">
                <div className="container grid-2">
                    <div className="intro-text">
                        <h2 className="section-title">Welcome to EP INTWALI</h2>
                        <p>Ecole Primary Intwali (EP INTWALI) is a premier primary school located in Nyarugenge District. We provide a supportive and stimulating environment where every child can flourish academically and socially.</p>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">52+</span>
                                <span className="stat-label">Years Experience</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">800+</span>
                                <span className="stat-label">Total Students</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">95%</span>
                                <span className="stat-label">Passing Rate of PLE</span>
                            </div>
                        </div>
                    </div>
                    <div className="intro-image-container">
                        <img src="/src/assets/about.jpg" alt="Headmaster of EP INTWALI" className="intro-image" />
                        <div className="image-overlay">
                            <h3>Dedicated to Excellence</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
