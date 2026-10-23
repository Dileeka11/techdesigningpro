// Service pages – copied word for word from services.php?mainid=5&subid=1..4
// of the original site. Each detail section on the old site sat next to one
// image; that pairing is kept here.

export type Feature = { title: string; text: string };
export type LabeledPoint = { label: string; text: string };
export type DetailSection = {
  title: string;
  paragraphs: string[];
  listTitle?: string;
  list?: string[];
  subsections?: Feature[];
  image?: string;
};

// ---------------------------------------------------------------------------
// Project Management
// ---------------------------------------------------------------------------
export const projectManagement = {
  slug: "project-management",
  title: "Project Management",
  intro: {
    title: "Introduction",
    text: "Welcome to TechDesigningPro, a leading interior fitout project management company dedicated to transforming spaces into functional, aesthetically pleasing environments. With a focus on delivering high-quality solutions, we pride ourselves on our comprehensive project management services that cater to a diverse range of industries and clients.",
  },
  features: [
    {
      title: "Interior Fitout Project Management",
      text: "Our core service involves end-to-end project management for interior fitout projects. We oversee every aspect, from initial design and planning to construction, installation, and final handover. Our experienced team ensures projects are executed on time, within budget, and to the highest quality standards.",
    },
    {
      title: "Design Coordination",
      text: "We collaborate closely with architects, designers, and other stakeholders to translate design concepts into actionable plans. Our design coordination ensures a seamless integration of aesthetics and functionality.",
    },
    {
      title: "Budgeting and Cost Management",
      text: "We provide transparent and accurate budgeting, cost estimation, and management services. Our goal is to optimize resources without compromising on quality.",
    },
    {
      title: "Procurement and Supply Chain Management",
      text: "We handle procurement of materials, furniture, fixtures, and equipment, ensuring timely delivery and adherence to project specifications.",
    },
    {
      title: "Construction Oversight",
      text: "Our on-site construction management ensures that the project progresses smoothly, adhering to safety standards and design intent.",
    },
    {
      title: "Quality Assurance",
      text: "We implement rigorous quality control measures at every stage to ensure the final outcome meets the highest industry standards.",
    },
    {
      title: "Timeline Management",
      text: "We create realistic project timelines and schedules, closely monitoring progress to ensure timely completion.",
    },
    {
      title: "Stakeholder Communication",
      text: "Clear and effective communication is vital in any project. We maintain open channels of communication with all stakeholders, keeping them informed about project updates and milestones.",
    },
    {
      title: "Post-Completion Support",
      text: "Our commitment extends beyond project completion. We provide post-occupancy evaluations and support to address any potential concerns.",
    },
  ] satisfies Feature[],
  image: "img/project",
  industries: {
    title: "Industries We Serve",
    items: [
      "Commercial Offices",
      "Retail Spaces",
      "Hospitality and Restaurants",
      "Healthcare Facilities",
      "Residential Apartments",
      "Educational Institutions",
      "Cultural and Recreational Centers",
      "And more...",
    ],
  },
  why: {
    title: "Why Choose us?",
    points: [
      { label: "Expertise:", text: "Our team consists of seasoned professionals with extensive experience in interior fitout project management." },
      {
        label: "Client-Centric Approach:",
        text: "We prioritize understanding our clients unique needs and goals, tailoring our services to meet their specific requirements.",
      },
      { label: "Innovation:", text: "We stay updated with the latest industry trends and technologies, incorporating innovative solutions into our projects." },
      { label: "Quality:", text: "We are committed to delivering superior quality in every aspect of our work, from design to execution." },
    ] satisfies LabeledPoint[],
  },
};

// ---------------------------------------------------------------------------
// Procurement Management (FF & E)
// ---------------------------------------------------------------------------
export const procurement = {
  slug: "procurement-management",
  title: "Procurement Management (FF & E)",
  intro: {
    title: "Introduction",
    text: "We at Techdesigningpro are leaders of comprehensive procurement and supply chain solutions, dedicated to optimizing purchasing processes and driving efficiency for businesses across various industries. With a proven track record of delivering cost savings, improved vendor relationships, and streamlined procurement operations, we are committed to helping our clients achieve their strategic procurement objectives.",
  },
  features: [
    {
      title: "Strategic Sourcing",
      text: "We analyze market trends, identify reliable suppliers, and negotiate favorable terms to ensure your organization procures goods and services at the best possible prices.",
    },
    {
      title: "Supplier Management",
      text: "Our experts establish and maintain strong relationships with suppliers, monitor performance, and implement strategies for continuous improvement.",
    },
    {
      title: "Procurement Process Optimization",
      text: "We assess your current procurement processes, identify bottlenecks, and implement efficient workflows to drive productivity and reduce operational complexities.",
    },
    {
      title: "Cost Analysis and Savings",
      text: "Our team conducts in-depth cost analysis, identifies areas for savings, and implements strategies to minimize expenses without compromising quality.",
    },
    {
      title: "Contract Management",
      text: "We manage the entire contract lifecycle, from drafting and negotiation to compliance monitoring, ensuring your organization is always protected and in alignment with vendor agreements.",
    },
    {
      title: "Risk Mitigation",
      text: "By conducting thorough risk assessments, we help mitigate potential disruptions to your supply chain, ensuring business continuity even in challenging situations.",
    },
    {
      title: "Technology Integration",
      text: "We leverage cutting-edge procurement technologies to enhance visibility, automation, and data-driven decision-making, resulting in optimized procurement outcomes.",
    },
  ] satisfies Feature[],
  image: "img/procurement",
  industries: {
    title: "Industries We Serve",
    text: "Our expertise spans various industries, including but not limited to manufacturing, healthcare, IT, construction, retail, and hospitality. We tailor our services to meet the unique needs and challenges specific to each sector.",
  },
  why: {
    title: "Why Choose us?",
    points: [
      {
        label: "Experience:",
        text: "With over a decade of experience, we have successfully managed procurement for organizations of all sizes, from startups to multinational corporations.",
      },
      { label: "Expert Team:", text: "Our team comprises seasoned procurement professionals, sourcing specialists, contract negotiators, and supply chain experts." },
      {
        label: "Results-Driven:",
        text: "We are dedicated to delivering measurable results, including cost savings, process efficiencies, and enhanced supplier relationships.",
      },
      {
        label: "Client-Centric Approach:",
        text: "We collaborate closely with clients, understanding their goals and challenges to tailor solutions that align with their business objectives.",
      },
      {
        label: "Innovation:",
        text: "We stay updated with industry trends and adopt innovative technologies to ensure our clients stay ahead in an ever-evolving procurement landscape.",
      },
    ] satisfies LabeledPoint[],
  },
};

// ---------------------------------------------------------------------------
// AutoCAD
// ---------------------------------------------------------------------------
export const autocad = {
  slug: "autocad",
  title: "AutoCAD",
  intro: {
    title: "AutoCAD: The Industry Standard for Drafting",
    paragraphs: [
      "AutoCAD is an essential tool in the engineering industry, providing precise drafting capabilities that are unmatched by any other software. Its user-friendly interface allows engineers to create detailed drawings quickly and efficiently, saving valuable time and resources.",
      "One of the key features of AutoCAD is its ability to create 3D models, allowing engineers to visualize their designs in a more realistic way. This feature is especially useful when designing complex structures or products that require intricate details. Additionally, AutoCAD has a vast library of pre-made components that can be easily incorporated into designs, further streamlining the drafting process.",
    ],
    image: "img/about_4",
  },
  sections: [
    {
      title: "Schematic Design",
      paragraphs: [
        "In this phase, the designer creates a rough sketch of the design concept. The sketch is then converted into a digital format using AutoCAD software. This phase helps to visualize the design concept and make any necessary changes before moving on to the next phase.",
      ],
      image: "img/auto1",
    },
    {
      title: "DESIGN DEVELOPMENT",
      paragraphs: [
        "In this phase, the design concept is developed into a more detailed plan. The designer adds more details to the design, including furniture, fixtures, and equipment. This phase also includes creating elevations, sections, and 3D models of the design. The AutoCAD drawings are used to create a more accurate representation of the design.",
      ],
      image: "img/auto2",
    },
    {
      title: "Detailed Design",
      paragraphs: [
        "In this phase, the design is finalized and all details are added to the drawings. The AutoCAD drawings are used to create construction documents, including floor plans, elevations, sections, and details. These documents are used by contractors to build the design. The designer also creates schedules and specifications for the project.",
      ],
      image: "img/auto3",
    },
    {
      title: "Tender Stage",
      paragraphs: [
        "In this phase, the construction documents are sent out to contractors for bidding. The AutoCAD drawings are used to create accurate cost estimates for the project. The designer works with the client to select a contractor for the project.",
      ],
      image: "img/auto4",
    },
    {
      title: "Issued for Construction",
      paragraphs: [
        "In this phase, the final construction documents are issued to the contractor. The AutoCAD drawings are used to guide the construction process. The designer works closely with the contractor to ensure that the design is built according to the drawings. Any changes to the design are documented and approved by the client before they are implemented.",
      ],
      image: "img/auto5",
    },
  ] satisfies DetailSection[],
};

// ---------------------------------------------------------------------------
// Revit (incl. BIM360) – the old page grouped its services in four tabs.
// ---------------------------------------------------------------------------
const commonPipingList = [
  "Modelling of all plumbing systems",
  "Coordinating with other trades during pre-construction",
  "Optimizing the systems to lower material & labour costs",
  "Generating shop drawings",
  "Generating fabrication spools",
  "Generating bill of materials",
];

export const revit = {
  slug: "revit",
  title: "Revit",
  intro: [
    {
      title: "Revit: The Future of Building Design",
      paragraphs: [
        "Revit is the future of building design. Its benefits are numerous, including improved collaboration, accuracy, and efficiency.",
        "With Revit, architects and engineers can work together seamlessly to create complex designs in a fraction of the time it would take using traditional methods. The software advanced features allow for real-time collaboration, reducing errors and ensuring that all team members are on the same page.",
      ],
      image: "img/about_2",
    },
    {
      title: "BIM360: Streamlining Construction Management",
      paragraphs: [
        "BIM360 is a powerful tool that can significantly improve your construction management processes. With its advanced project tracking capabilities, you can easily monitor progress and identify potential issues before they become major problems. Its document management features also make it easy to keep all your project information organized and accessible in one place. And with its seamless communication tools, you can ensure that everyone on your team is always on the same page.",
        "In fact, studies have shown that using BIM360 can lead to a 20% increase in productivity and a 30% reduction in rework. This means that not only will you be able to complete your projects faster, but you will also save money in the process. So if you are looking for a way to streamline your construction management processes and improve your bottom line, BIM360 is definitely worth considering.",
      ],
      image: "img/about_3",
    },
  ],
  tabs: [
    {
      id: "architects",
      label: "Architects",
      sections: [
        {
          title: "SCHEMATIC DEVELOPMENT",
          paragraphs: [
            "As schematic design is the first phase of basic services for project design, we help the Architects to design the preliminary ideas. At this stage in a project, we describe the project three-dimensionally. We can explore a range of alternative design concepts to define the character of the completed project and an optimum realization of the project program.",
          ],
          image: "img/img1",
        },
        {
          title: "DESIGN DEVELOPMENT",
          paragraphs: [
            "During the design development phase, the project design is further refined. Plan arrangements, specific space accommodations, equipment and furnishings, building design, materials and colours, and complete definitions of all systems serving the project are developed. TechDesigningPro helps the Architects to achieve this task in all the stages. All design decisions are completed during this phase in order to prepare the subsequent construction documents.",
          ],
          image: "img/img2",
        },
        {
          title: "3D BUILDING INFORMATION MODELLING",
          paragraphs: [
            "In many ways, a 3D model can be created. A 3D model is a geometry-only model that contains only shapes and dimensions. But on the other hand, in a 3D BIM model, we add all the information to the different trade 3D models (Architecture, Structure, Electrical, Plumbing). Often this information includes, architectural, installation, material, and construction details. These 3D building models are linked and incorporated to produce a comprehensive 3D model. Therefore, in short, we create the data-based model of architectural design, structural design, and MEP design.",
          ],
          image: "img/img3",
        },
        {
          title: "SHOP DRAWINGS / CONSTRUCTION DOCUMENTS",
          paragraphs: [
            "We prepare the drawings and specifications establishing the requirements for the construction of the project. The construction documents that we create describe the quality, configuration, size, and relationship of all components to be incorporated into the project. Our construction documents will be consistent with the project program, the construction budget, and the project schedule.",
            "First, we submit the construction documents that include a complete set of architectural drawings (site plan, floor plans, sections, details, etc.) for review by Architects and others. As determined by us, we prepare drawings at 50% completion, 100% completion. and then final submission for a final backcheck after all corrections are made.",
            "We will make sure to incorporate all resulting changes into the 100% documents prior to submitting the final backcheck set for approval purposes.",
          ],
          image: "img/img4",
        },
        {
          title: "PREPARING CLASH REPORTS",
          paragraphs: [
            "Engineering design requires effective coordination between several stakeholders for desired results. In the current era, any construction design project involves several stakeholders such as structural engineers, architects, contractors, suppliers and vendors, sometimes making the project completion process highly complex.",
            "Architects, structural engineers, MEP engineers (HVAC, Electrical and Plumbing), environmental engineers and other professionals create design models, independent from each other. Once all the models are integrated into the BIM modelling process, clash detection comes into the picture. We provide Clash Detection and Clash Report Generation services. Our clash report will be available in different formats such as text, XML, HTML etc.",
          ],
          image: "img/img5",
        },
        {
          title: "LANDSCAPE MODELLING",
          paragraphs: [
            "Building information modelling can bring numerous benefits to landscape architects. Landscape architects work with general contractors, architects, real estate developers and project managers. It is important for them to work collaboratively with all project stakeholders using the right landscape architectural tools.",
            "Delivering the landscape architecture in BIM could also be a mandate for some of the projects due to contractual requirements. The landscape BIM certainly helps all the stakeholders in the ecosystem to collaborate, communicate and deliver the project efficiently. The landscape BIM modelling can bring numerous advantages to the overall workflow and processes. It helps achieve faster drawing production, faster and accurate quantities and seamless collaboration with architects using BIM models. We help our clients prepare the overall project BIM model along with a detailed landscape model that includes all necessary landscape planting schemes such as large planting areas, hedges, planting centres, and mixes.",
          ],
          image: "img/img6",
        },
        {
          title: "FACADE ENGINEERING (BIM & DETAILING)",
          paragraphs: [
            "The facade is the primary moderator of the environment for all buildings. Our team of facade detailers work closely with architects, structural engineers, contractors, manufacturers, installation specialists and consultants. We provide Facade BIM services for urban infrastructure, high-rise buildings, shopping malls, hotels, resorts, skyscrapers, apartments, and commercial buildings. Our Facade BIM Coordinators ensure that the design is fully coordinated among the other trades involved.",
          ],
          listTitle: "OUR FACADE BIM SERVICES INCLUDES:",
          list: [
            "3D Facade modelling for Glazing & Cladding Systems",
            "3D Facade modelling Aluminium curtain wall system (Stick and Unitized systems)",
            "Facade BIM services coordination (Resolution of clashes with architecture, structure, interior & MEP models)",
            "Metal composite panel cladding",
            "Facade BOQ or material take-off",
            "As-built facade modelling",
            "Facade shop drawings (floor/key plans, elevations, sections, Partial Plans, typical details & interface details",
          ],
          image: "img/img7",
        },
        {
          title: "FAMILY CREATION",
          paragraphs: [
            "BIM families creation requires specialized expertise as each and every element of the family has to be modelled, keeping the geometry of the family at the core. Our BIM Library creation services for building product model catalogues to the architect, engineer, fabricator and manufacturer. Our Revit Family provides detailed information about a physical product. Components object and Material/Layered objects are two types of BIM objects.",
          ],
          listTitle: "OUR REVIT FAMILY CREATIONS SERVICES INCLUDE:",
          list: [
            "Architecture family creation",
            "Structural family creation",
            "MEP family creation",
            "Building system families",
            "BIM families",
            "Structural components",
            "Fixtures, custom applications",
            "Partitions, windows, walls, and doors",
            "Related custom and supporting content",
          ],
          image: "img/img8",
        },
        {
          title: "VISUALIZATION",
          paragraphs: [
            "Visualizations and illustrations are key in the planning stage of a building project. Different possibilities and options can be compared with different stakeholders in an early stage. Our visualization services enhance communication through all the stages of a project and are especially vital in the marketing process. Our services include:",
          ],
          list: ["Visualized pictures", "3D animations", "Virtual reality"],
          image: "img/img9",
        },
      ] satisfies DetailSection[],
    },
    {
      id: "structural",
      label: "Structural Engineers",
      sections: [
        {
          title: "2D TO 3D CONVERSION",
          paragraphs: [
            "Converting data between different types of CAD systems requires experience with different formats, data conversion skills, and attention to detail. Our BIM engineers are highly skilled at the translation of common CAD formats into the deliverable of your needs. We can deliver 2D to 3D BIM models for global manufacturing firms, architectural consultants and engineers from various industries. We also transform scanned images, paper drawings, pdf and conceptual sketches in 2D to 3D BIM structural models using Revit.",
          ],
          listTitle: "WHAT OFFERS THE FOLLOWING 2D TO 3D CONVERSION SERVICES:",
          list: [
            "2D to 3D rendered Architectural floor plans",
            "Detailed 3D modelling based on 2D drawings",
            "Transform 2D drawings to 3D coordinate models",
            "BIM-ready models from 2D drafts and conceptual sketches",
          ],
          image: "img/img21",
        },
        {
          title: "STRUCTURAL MODELLING",
          paragraphs: [
            "BIM Engineers at TechDesigningPro help structural professionals to design, detail, document, and fabricate structural systems. Our BIM experience enables project teams to work more collaboratively–helping to optimize designs, improve accuracy, and connect design to fabrication to deliver projects faster and more efficiently. We help structural engineers optimize and automate designs, reduce errors and risk, and improve accuracy and constructability while improving overall project delivery. We will make it easier to see how the architectural components will be integrated with the structural members, and where HVAC units, pipes, and openings occur and need to be worked around or supported.",
          ],
          listTitle: "OUR STRUCTURAL BIM SERVICES INCLUDE :",
          list: [
            "Generating bill of materials",
            "Generating shop drawings",
            "Modelling of all structural elements per design drawings",
            "Coordinating with architect & general contractor per field conditions",
          ],
          image: "img/img22",
        },
        {
          title: "DESIGN DEVELOPMENT",
          paragraphs: [
            "During the design development phase, the project design is further refined. Plan arrangements, specific space accommodations, equipment and furnishings, building design, materials and colours, and complete definitions of all systems serving the project are developed. TechDesigningPro help the Architects to achieve this task in all the stages. All design decisions are completed during this phase in order to prepare the subsequent construction documents.",
          ],
          image: "img/img23",
        },
        {
          title: "CONCRETE LIFT DRAWINGS",
          paragraphs: [
            "Lift drawings are typically used for complex pours – Yes! we can handle your job. Concrete lift drawings are created to communicate all the necessary information regarding a concrete pour to the field crew. To get all of the right information into the drawings, the entity creating the lift drawings needs to effectively communicate with the design team, the concrete contractor team members, other subcontractors, and the general contractor. TechDesigningPro BIM service is key to make sure the correct and current information is represented on the drawings.",
          ],
          listTitle: "OUR CONCRETE LIFT DRAWING SERVICES INCLUDE :",
          list: [
            "Foundation Plan",
            "Slab on Grade & Slab Arrangement",
            "Wall & Column Arrangement",
            "Reinforcement Shop Drawing",
            "Formwork Shop Drawing",
            "Wall Elevation",
            "Slab Soffit Plan",
            "Drawings for CMU and Wall Partition",
            "Drawings for Lintels",
          ],
          image: "img/img24",
        },
        {
          title: "REBAR DETAILING",
          paragraphs: [
            "TechDesigningPro provides rebar detailing services for manufacturers, fabricators, contractors, and structural engineers. We can provide fully detailed reinforcement drawings, coordinated models, reports, and bending schedules for any concrete structure, which can be easily followed by the factory teams or on-site teams.",
          ],
          listTitle: "OUR REBAR DETAILING SERVICES INCLUDE:",
          list: [
            "2D rebar detailing",
            "3D rebar detailing / BIM Model",
            "Rebar estimation services",
            "Foundation details",
            "Footing detailing",
            "Formwork modeling and detailing",
            "Bar bending schedule Plan",
            "Bar listing service in ASA format",
            "Roof truss and joint details",
          ],
          image: "img/img25",
        },
        {
          title: "STEEL DETAILING",
          paragraphs: [
            "For the structural components and their proper erection, it is very essential for design and construction professionals to be equipped with fabrication drawings and erection drawings. Our steel detailers will create shop drawings and erection drawings to resolve problems confronted by manufacturers during manufacturing and steel erectors during the final installation of structural components.",
          ],
          listTitle: "OUR STEEL DETAILING SERVICES INCLUDE:",
          list: [
            "Precise modeling of steel structure based on approved GA drawing",
            "Structural design and modelling of connections",
            "Preparation of fabrication & assembly drawings",
            "Preparation of erection drawing, anchor bolt drawings connection sketches And design calculations",
            "Preparation of shop bolt list, bolt location list, assembly drawing's",
          ],
          image: "img/img26",
        },
        {
          title: "PRECAST DETAILING",
          paragraphs: [
            "TechDesigningPro provides the engineering support you need to optimize your precast concrete projects. From the initial design concept right through to the production, we help you visualize, simulate, and document excellent graphical illustrations of your construction projects. We model all types of precast structures complete with connections, concrete embeds, and even the most complex rebar.",
            "Our model includes all the information for generating drawings, reports, and fabrication data. Our accurate 3D information helps everybody understand the design intent and improves collaboration between design, factory, and site.",
          ],
          listTitle: "OUR PRECAST DETAILING SERVICES INCLUDE:",
          list: [
            "Erection drawing",
            "Precast shop drawings",
            "Precast fabrication drawings",
            "Marking plan",
            "Wall panel detailing",
            "Bar bending schedule",
            "Beam and column detailing",
            "BIM coordination",
            "Bill of materials",
            "Quantity take-off",
          ],
          image: "img/img27",
        },
        {
          title: "AS-BUILT MODELLING",
          paragraphs: [
            "Once a building is completed, the as-built drawings are the only resource if there are any renovations to be done in the future. As-Built BIM Model is mainly utilized to check if the structure needs renovations or not. The inaccuracy and lack of comprehension in data are solved by As-Built BIM. The As-Built Model portrays the built stage in each discipline such as Structural, Architectural, and MEPF. We also create an integrated As-Built BIM model by incorporating change and alteration of information such as Manufacturer-related information.",
          ],
          listTitle: "OUR AS-BUILT SERVICES INCLUDE:",
          list: [
            "2D As-Built drawings",
            "Data processing",
            "Additional semantic information",
            "As-Built documentation",
            "Contractor/subcontractor markups",
            "As-Built BIM deliverables",
          ],
          image: "img/img28",
        },
      ] satisfies DetailSection[],
    },
    {
      id: "mep",
      label: "MEP Engineers",
      sections: [
        {
          title: "Mechanical Piping Detailing",
          paragraphs: [
            "Our mechanical piping modelling service includes the creation and use of coordinated, consistent and computable information. We create extremely skilled drafting services for all kinds of commercial and residential industries. Our BIM models will follow specified standards to ensure the certainty of geometry, workflows, and scheduling. With more than 2 decades of hands-on experience in BIM, we are able to handle any issue in it and we are able to bring a solution for it by our highly experienced team.",
            "The mechanical rooms that we create are perplexing spaces containing chillers, warm exchangers, pressure vessels, control valves, stand funnels, swing-jolt conclusion, sterile boilers, and conduits. In our procedure, we break down the whole framework design and illustrations to give the prepared model consideration of the various parts of conflicts, get to spaces, future repairs and so on.",
            "In spite of that, we may propose alterations in the game plan of gear and channels, their area and separating to achieve the greatly desired outcomes. Also, we offer services such as spool drawing, family creation, BOQ of materials, collision detection and point cloud creation.",
          ],
          listTitle: "OUR MECHANICAL PIPING DETAILING SERVICES INCLUDE:",
          list: commonPipingList,
          image: "img/img31",
        },
        {
          title: "PLUMBING DETAILING",
          paragraphs: [
            "With our BIM services, one can facilitate 3D visualization of all kinds of plumbing related elements in a building. We have great skills in integrating plumbing drafting and plumbing detailing that spans from configuration to drafting. Whether it is fabrication drawing, fitting, quantity estimation, etc, we will provide solutions to our plumbing contractors.",
            "TechDesigningPro creates 3D plumbing models that result in an overall cost reduction along with boosting productivity on construction sites. We try to deliver the best solution and technological expertise that enables our long list of customers to develop faith in us in matters of quality and affordability. Through implementing BIM on their projects, plumbing contractors can immensely cut down on the waste and reduce rework during construction. It enhances the easiness in construction scheduling and reduction of collision errors and even makes it easier to track the material at an early stage.",
            "We create 3D models of all domestic utilities like water, sanitation, and gas, including the underground sections. Our experts, during the conversion of design into the 3D model, assign the slope of sanitary pipes and check the constructability of underground utilities. The converted BIM models track coordination and checks for the interference of any elements of MEP. Our services also extend to family creation of all plumbing fixtures, point cloud creation, pipe spool drawing, and sleeve penetration drawing.",
          ],
          listTitle: "OUR PLUMBING DETAILING SERVICES INCLUDE:",
          list: commonPipingList,
          image: "img/img32",
        },
        {
          title: "HVAC DETAILING",
          paragraphs: [
            "Our in-house BIM modellers are specialized in 3D modelling and drafting services for large-scale commercial, residential, and retail projects. With our highly trained and skilled employees, we give maximum accuracy output and save a huge amount of time, which maximizes our efficiency.",
            "As a technology-first company, our team of skilled HVAC personnel gets every detail in line for maximum accuracy and onsite compatibility. We continuously strive to deliver high-quality BIM services for HVAC contractors, fabricators, and manufacturers.",
            "We deliver full-service Mechanical HVAC solutions that incorporate information-rich graphical models that collaborate with the requirements of your project. Our service includes the creation of fully coordinated 3D models of all HVAC systems along with Mechanical duct, equipment modelling, point cloud creation and library creation of HVAC components. We pay special attention to clash detection for coordinated Architectural and Structural models.",
          ],
          listTitle: "OUR HVAC DETAILING SERVICES INCLUDE:",
          list: [
            "Modelling of all HVAC systems",
            "Coordinating with other trades during pre-construction",
            "Optimizing the systems to lower material & labor costs",
            "Generating shop drawings",
            "Generating fabrication spools",
            "Generating bill of materials",
          ],
          image: "img/img33",
        },
        {
          title: "ELECTRICAL DETAILING",
          paragraphs: [
            "As per the design drawings, we develop 3D models of electrical equipments, conduits, cable trays, lighting fixtures, communication & data transmission devices, network routing, fire alarm systems etc.",
            "With adequate proficiency in modelling, TechDesigningPro upholds the client’s anticipation of potential issues before and during the construction phase.",
          ],
          listTitle: "OUR ELECTRICAL DETAILING SERVICES INCLUDE:",
          list: [
            "Modelling of all electrical equipment",
            "Electrical Lighting Fixtures Modelling",
            "Preparation of lighting & power circuit drawings",
            "BOQ of Electrical equipment",
            "Schedules of circuits and panel boards",
            "Modelling of cable trays and conduits as per the given layout",
            "Modelling of panel boards",
            "Electrical room modelling",
            "Fire alarm systems modelling",
            "Modelling of Data & Communication Systems",
            "Coordinating with other trades during pre-construction",
            "Generating shop drawings",
          ],
          image: "img/img34",
        },
        {
          title: "FIRE PROTECTION PIPING",
          paragraphs: [
            "Fundamental to every building project is fire protection systems that will provide the opportunity to reduce fire damage with automatic and manual fire extinguishing systems. We are specialized in converting a detailed fire sprinkler and piping modelling design into the 3D fire protection piping model. While modelling, we consider all the risk factors in it and we provide the files with 100% accuracy in detail and on time.",
          ],
          listTitle: "OUR FIRE PROTECTION PIPING SERVICES INCLUDE:",
          list: [
            "Conversion of 2D fire protection design/drawings to 3D fire protection model",
            "MEPFP BIM coordination & BIM clash detection",
            "Fire Protection drawings Shop drawings | Fabrication Spools | construction documents",
            "4D Scheduling, 5D estimation, Bills of Materials, BOQ",
            "Generating fabrication spools",
            "Parametric model and library creation of Fire Protection components",
          ],
          image: "img/img35",
        },
        {
          title: "FABRICATION SPOOLING",
          paragraphs: [
            "BIM enables digital design-to-fabrication workflows for all building disciplines. A pipe spool drawing is a useful MEP tool for plumbers as it enables them to understand how to assemble a pipe spool and its components. It also provides all the information required for fabrication manufacturing and assembly pipe spool drawings to ensure that nothing goes wrong and makes sure time and money are not misspent. Pre-fabrication helps contractors to improve quality, handle materials and reduce construction costs. At the construction site, plumbers use the pipe spool drawings as a guideline to install the assembly",
          ],
          listTitle: "OUR FABRICATION SPOOLING SERVICES INCLUDE:",
          list: [
            "Generating spools for fabrication",
            "Isometric drawings",
            "Markup detailing",
            "Patent drawings",
            "As-built drawings",
            "Parametric drawings",
            "Assembly drawings",
            "Mechanical shop drawings",
          ],
          image: "img/img36",
        },
      ] satisfies DetailSection[],
    },
    {
      id: "general",
      label: "General Contractors",
      sections: [
        {
          title: "3D Modelling & Coordination",
          paragraphs: [
            "TechDesigningPro has hands-on experience in creating BIM models from scratch. We create 3D models from inputs such as PDF markups, AutoCAD or Point Cloud files. With regards to co-ordination, we help to collaborate between MEP engineers, structural engineers and architects.",
          ],
          subsections: [
            {
              title: "CLASH DETECTION & REPORTING",
              text: "Once the models for various disciplines are developed, we perform clash detection using industry-leading software tools and generate customized clash reports for each trade. Clash detection can accelerate the coordination process between disciplines by identifying issues between models faster and more thoroughly.",
            },
            {
              title: "CONSTRUCTABILITY REVIEW",
              text: "TechDesigningPro BIM-based Constructability analysis will help the general contractors to review construction processes/methods during the design phase and identify potential obstacles and design flaws that might result in schedule delays, cost overruns, rework, etc. As the project goes on the identified issues will be fixed by us.",
            },
            {
              title: "RESOLUTION & SUPPORT",
              text: "TechDesigningPro works with Architects, Engineers to help in the design development stage. During these stages, we help to resolve the clashes and implement the agreed changes in the models to create coordinated models. We also give suggestions for the designs. This results in a reduced number of change orders. The change in the model is visible to the whole team and fosters collaboration between the contractor and other stakeholders.",
            },
            {
              title: "ACCURATE PROJECT BIDS",
              text: "We help contractors to develop accurate bids using BIM by accounting for the quantity of materials, systems, costs, and other nuances. The process not only leads to higher bid accuracy but also makes it faster.",
            },
          ],
          image: "img/img41",
        },
        {
          title: "4D CONSTRUCTION SEQUENCING",
          paragraphs: [
            "By federating different trade 3D model representations, TechDesigningPro is capable of producing intelligent 3D visual construction programmes. During the early project stages, 4D models can be used by the delivery team to view the forecasted time-based processes.",
            "This 4D construction sequencing combines 3D models with project programmes, creating an intelligent visual construction timeline. Being able to interrogate a 3D graphical representation of the proposed project programme, enables the project delivery team to identify and resolve previously obscured logistical issues and potential health and safety issues.",
          ],
          image: "img/img42",
        },
        {
          title: "5D BIM SIMULATION",
          paragraphs: [
            "Using 5D BIM, or five-dimensional building information modelling, TechDesigningPro can do the real-time extraction or development of fully valued parametric building components within a virtual model. It allows experienced users to create models that demonstrate how changes to materials, layouts, square footage and other design elements not only affect the appearance of a facility, but also the cost and schedule of construction",
          ],
          image: "img/img43",
        },
        {
          title: "FACILITY MANAGEMENT & OPERATIONS",
          paragraphs: [
            "BIM’s role in facilities management is to provide quantifiable insights.",
            "As we have all heard, BIM is changing the way in which buildings are designed and built, but it is important to emphasize that this methodology also affects how these buildings are managed and maintained.",
            // NOTE: this sentence is cut off on the original website as well – kept unchanged.
            "TechDesigningPro can take all the different data sources and combine them all together into one 3D model wi",
          ],
          image: "img/img44",
        },
      ] satisfies DetailSection[],
    },
  ],
};

export const allServices = [projectManagement, revit, autocad, procurement];
