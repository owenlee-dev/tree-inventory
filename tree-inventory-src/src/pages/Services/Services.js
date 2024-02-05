import servicesHero from "../../assets/images/services-hero.png";
import "./services.scss";
import { useSelector } from "react-redux";
import { domeImages, yurtImages, busImages, cabinImages } from "./RentalImages";
import Carousel from "../../components/Carousel";
import { Link } from "react-scroll";
function Services() {
  const isMobile = useSelector((state) => state.appSlice.isMobile);
  return (
    <div className="content-container">
      <div className="services-hero">
        {!isMobile && (
          <div className="services-hero-left">
            <img alt="dome hero" src={servicesHero} />
          </div>
        )}
        <div className="services-hero-right">
          <h1>Come Stay With Us!</h1>
          {isMobile && <img alt="dome hero" src={servicesHero} />}

          <p>
            Located just an hour from Halifax and a stone's throw away from the
            epic Shubenacadie River and the Bay of Fundy, our property is an
            ideal starting point for endless exploration. Whether you fancy a
            leisurely walk, a ski trip, or a scenic bike ride, the sprawling
            5-mile river trail offers a bounty of natural beauty.
          </p>
          <p className="bold">
            On-site professional massage and reiki services available with any
            rental
          </p>
          <p>
            Discover a unique getaway experience with our cozy accomodations
            nestled in nature.{" "}
          </p>
        </div>
      </div>
      <div className="possible-rentals">
        <div>
          <h2>Short Term Rentals</h2>
          <p>
            Available on a night by night basis, boasting "Guest Favorite"
            status on AirBNB
          </p>
          <ul>
            <li>
              <Link
                to="dome"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
              >
                Earth and Aircrete Dome Home
              </Link>
            </li>
            <li>
              <Link
                to="yurt"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
              >
                Forest Yurt
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Longer Stays</h2>
          <p>Available for extended retreats or work-exchange opportunities</p>
          <ul>
            <li>
              <Link to="bus" spy={true} smooth={true} offset={0} duration={500}>
                Rennovated School Bus
              </Link>
            </li>
            <li>
              <Link
                to="cabin"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
              >
                Rustic Cabin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div id="dome" className="rental-container">
        <div className="left">
          <h1>Earth and Aircrete Dome Home</h1>
          {isMobile && <Carousel images={domeImages} fixedSize={false} />}
          <p>
            Creative, charming, and cozy. this dome is constructed from aircrete
            and boasts finishes of clay plaster and natural earthen flooring.
            Equipped with all essentials for cooking, staying cozy, and ensuring
            a restful sleep, it's situated close to trails for hiking and skiing
            that meander towards rivers and cliffs. A wood stove provides
            warmth, while an external composting toilet is located 50 yards from
            the dome.
          </p>
          <a href="https://www.airbnb.ca/rooms/1041725069586524761?locale=en&_set_bev_on_new_domain=1706701673_OTUzYTdkNDcxZTA3&source_impression_id=p3_1706701674_wGkUSFcldcHG1x8B">
            Book and Learn More on Airbnb
          </a>
        </div>
        {!isMobile && (
          <div className="right">
            <Carousel images={domeImages} fixedSize={false} />
          </div>
        )}
      </div>
      <div id="yurt" className="inverse-rental-container">
        {!isMobile && (
          <div className="left">
            <Carousel images={yurtImages} fixedSize={false} />
          </div>
        )}
        <div className="right">
          <h1>Forest Yurt</h1>
          {isMobile && <Carousel images={yurtImages} fixedSize={false} />}
          <p>
            Nestled in the trees on a large deck with the sounds of birds and
            squirrels all around, this unique structure spans 15 ft across with
            14 triangular sides. It holds a double bed, dining table, rocking
            chair, 3 burner stove, sink with water, full kitchenette and all the
            cooking utensils you need. A wood stove radiates heat throughout the
            space, creating a snug and inviting atmosphere.
          </p>
          <a href="https://www.airbnb.ca/rooms/45376458?locale=en&_set_bev_on_new_domain=1706374858_ZWRiY2YzMzZjOTM5">
            Book and Learn More on Airbnb
          </a>
        </div>
      </div>
      <div id="bus" className="rental-container">
        <div className="left">
          <h1>Rennovated School Bus</h1>
          {isMobile && <Carousel images={busImages} fixedSize={false} />}
          <p>
            The nostalgia of a school bus meets modern comfort and style. We've
            transformed a classic school bus into a cozy retreat space. Boasting
            high-speed onboard wifi, a propane stove, and a woodstove for when
            the evening chill sets in.
          </p>
          <p className="contact-us">
            For more information surrounding rentals, contact us at
            maplegrovepermaculture@gmail.com
          </p>
        </div>
        {!isMobile && (
          <div className="right">
            <Carousel images={busImages} fixedSize={false} />
          </div>
        )}
      </div>
      <div id="cabin" className="inverse-rental-container">
        {!isMobile && (
          <div className="left">
            <Carousel images={cabinImages} fixedSize={false} />
          </div>
        )}
        <div className="right">
          <h1>Rustic Cabin</h1>
          {isMobile && <Carousel images={cabinImages} fixedSize={false} />}
          <p>
            This spacious two-story cabin, larger than our other rentals, offers
            a cozy wood stove, a simple kitchen, and a living area on the main
            floor, complemented by a loft bedroom upstairs where you can wake up
            to views of the treetops. Although charming, the cabin has a rustic
            charm with visible studs and windows lacking trim, giving it an
            unfinished feel. Despite this, guests consistently describe it as a
            peaceful and cozy retreat!
          </p>
          <p className="contact-us">
            For more information surrounding rentals, contact us at
            maplegrovepermaculture@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default Services;
