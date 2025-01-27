import Hero from "@/components/Home/Hero";

export default function Home() {


  const homeHeroProps = {
    title: "Professional IT Solutions for",
    description:
      "Comprehensive IT services including custom software development, cloud solutions, enterprise systems, and digital transformation. From MVF development to full-scale enterprise solutions, we deliver excellence.",
    flipWords: [
      "Mobile App Development",
      "Custom Development",
      "Cloud Architecture",
      "Digital Transformation",
      "DevOps Excellence",
    ],
    imageSlides: [
      "https://img.freepik.com/free-vector/ipo-stock-launch-background-with-financial-growth-arrow_1017-52772.jpg",
      "https://img.freepik.com/free-photo/businessman-presses-button-ipo-initial-public-offering-chart-phone_493343-29967.jpg",
    ],
    teamMembers: [
      {
        id: 1,
        name: "Brijesh Joshi",
        designation: "CEO",
        image: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
      },
      {
        id: 2,
        name: "Manoj Kumar",
        designation: "Full Stack Developer",
        image: "https://api.uifaces.co/our-content/donated/FJkauyEa.jpg",
      },
      {
        id: 3,
        name: "Mike Brown",
        designation: "Lead Architect",
        image: "https://api.uifaces.co/our-content/donated/1H_7AxP0.jpg",
      },
    ],
  };


  return (
    <section>
      <Hero {...homeHeroProps} />
    </section>
  );
}
