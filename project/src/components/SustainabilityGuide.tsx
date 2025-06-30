import React, { useState } from 'react';
import { X, Search, BookOpen, Target, BarChart3, Leaf, Users, TrendingUp, Globe, Lightbulb } from 'lucide-react';

interface SustainabilityGuideProps {
  isVisible: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const GUIDE_SECTIONS = {
  basics: {
    title: 'Sustainability Basics',
    icon: Leaf,
    color: 'green',
    content: [
      {
        term: 'Sustainability',
        definition: 'Meeting present needs without compromising future generations\' ability to meet their own needs.',
        example: 'Using renewable energy instead of fossil fuels to power our cities.'
      },
      {
        term: 'Three Pillars of Sustainability',
        definition: 'Environmental (planet), Social (people), and Economic (profit) - the foundation of sustainable development.',
        example: 'A company reducing emissions (environmental), providing fair wages (social), while maintaining profitability (economic).'
      },
      {
        term: 'Carbon Footprint',
        definition: 'Total greenhouse gas emissions caused directly or indirectly by an individual, organization, or product.',
        example: 'Your carbon footprint includes emissions from driving, flying, home energy use, and consumption habits.'
      },
      {
        term: 'Renewable Energy',
        definition: 'Energy from sources that naturally replenish themselves, like solar, wind, and hydroelectric power.',
        example: 'Solar panels converting sunlight into electricity without depleting natural resources.'
      },
      {
        term: 'Circular Economy',
        definition: 'Economic model focused on eliminating waste through reuse, recycling, and regeneration.',
        example: 'Designing products to be fully recyclable and creating closed-loop manufacturing systems.'
      }
    ]
  },
  esg: {
    title: 'ESG Framework',
    icon: BarChart3,
    color: 'purple',
    content: [
      {
        term: 'ESG',
        definition: 'Environmental, Social, and Governance - criteria used to evaluate companies\' sustainability and ethical impact.',
        example: 'Investors using ESG scores to choose companies that align with their values and long-term thinking.'
      },
      {
        term: 'Environmental (E)',
        definition: 'Company\'s impact on the environment, including climate change, pollution, and resource use.',
        example: 'Measuring a company\'s carbon emissions, waste management, and renewable energy adoption.'
      },
      {
        term: 'Social (S)',
        definition: 'How a company manages relationships with employees, suppliers, customers, and communities.',
        example: 'Fair labor practices, diversity initiatives, community investment, and product safety.'
      },
      {
        term: 'Governance (G)',
        definition: 'Company leadership, executive pay, audits, internal controls, and shareholder rights.',
        example: 'Board diversity, transparent reporting, ethical business practices, and anti-corruption measures.'
      },
      {
        term: 'ESG Investing',
        definition: 'Investment strategy that considers environmental, social, and governance factors alongside financial returns.',
        example: 'Choosing to invest in companies with strong ESG ratings while avoiding those with poor practices.'
      }
    ]
  },
  sdgs: {
    title: 'UN SDGs',
    icon: Target,
    color: 'blue',
    content: [
      {
        term: 'Sustainable Development Goals (SDGs)',
        definition: '17 global goals adopted by UN member states to achieve a better world by 2030.',
        example: 'Countries working together to end poverty, protect the planet, and ensure prosperity for all.'
      },
      {
        term: 'SDG 1: No Poverty',
        definition: 'End poverty in all its forms everywhere by 2030.',
        example: 'Providing social protection systems and equal access to economic resources.'
      },
      {
        term: 'SDG 7: Clean Energy',
        definition: 'Ensure access to affordable, reliable, sustainable, and modern energy for all.',
        example: 'Expanding renewable energy infrastructure and improving energy efficiency globally.'
      },
      {
        term: 'SDG 13: Climate Action',
        definition: 'Take urgent action to combat climate change and its impacts.',
        example: 'Implementing carbon pricing, renewable energy transitions, and climate adaptation measures.'
      },
      {
        term: 'SDG Indicators',
        definition: 'Specific metrics used to measure progress toward each Sustainable Development Goal.',
        example: 'Tracking poverty rates, renewable energy percentages, and greenhouse gas emissions.'
      }
    ]
  },
  climate: {
    title: 'Climate & Environment',
    icon: Globe,
    color: 'green',
    content: [
      {
        term: 'Climate Change',
        definition: 'Long-term shifts in global temperatures and weather patterns, primarily due to human activities.',
        example: 'Rising sea levels, extreme weather events, and changing precipitation patterns worldwide.'
      },
      {
        term: 'Greenhouse Gases',
        definition: 'Gases that trap heat in Earth\'s atmosphere, including CO2, methane, and nitrous oxide.',
        example: 'Carbon dioxide from burning fossil fuels is the largest contributor to global warming.'
      },
      {
        term: 'Net Zero',
        definition: 'Achieving balance between greenhouse gas emissions produced and removed from the atmosphere.',
        example: 'A company offsetting all its emissions through renewable energy and carbon capture projects.'
      },
      {
        term: 'Biodiversity',
        definition: 'Variety of life on Earth, including diversity within species, between species, and of ecosystems.',
        example: 'Protecting rainforests to preserve thousands of plant and animal species.'
      },
      {
        term: 'Carbon Offset',
        definition: 'Reduction in greenhouse gas emissions made to compensate for emissions produced elsewhere.',
        example: 'Planting trees or investing in renewable energy projects to offset flight emissions.'
      }
    ]
  },
  business: {
    title: 'Sustainable Business',
    icon: TrendingUp,
    color: 'orange',
    content: [
      {
        term: 'Corporate Social Responsibility (CSR)',
        definition: 'Business model where companies integrate social and environmental concerns into operations.',
        example: 'A company donating profits to charity while reducing its environmental impact.'
      },
      {
        term: 'Stakeholder Capitalism',
        definition: 'Business philosophy that serves all stakeholders: customers, employees, suppliers, communities, and shareholders.',
        example: 'Companies considering environmental and social impact alongside profit in decision-making.'
      },
      {
        term: 'Supply Chain Sustainability',
        definition: 'Managing environmental and social impacts throughout the entire supply chain.',
        example: 'Ensuring suppliers follow fair labor practices and environmental standards.'
      },
      {
        term: 'Green Finance',
        definition: 'Financial services and investments that support environmentally sustainable economic activities.',
        example: 'Green bonds funding renewable energy projects and sustainable infrastructure.'
      },
      {
        term: 'Impact Investing',
        definition: 'Investments made with intention to generate positive, measurable social and environmental impact.',
        example: 'Investing in companies developing clean technology or providing healthcare in underserved areas.'
      }
    ]
  },
  social: {
    title: 'Social Impact',
    icon: Users,
    color: 'blue',
    content: [
      {
        term: 'Social Equity',
        definition: 'Fair treatment, access, opportunity, and advancement for all people.',
        example: 'Ensuring equal access to education, healthcare, and economic opportunities regardless of background.'
      },
      {
        term: 'Inclusive Growth',
        definition: 'Economic growth that creates opportunity for all segments of the population.',
        example: 'Economic policies that reduce inequality while promoting overall prosperity.'
      },
      {
        term: 'Human Rights',
        definition: 'Basic rights and freedoms that belong to every person, including dignity, equality, and justice.',
        example: 'Ensuring fair wages, safe working conditions, and freedom from discrimination.'
      },
      {
        term: 'Community Development',
        definition: 'Process of improving the economic, social, and environmental conditions of communities.',
        example: 'Local initiatives to improve education, healthcare, and infrastructure in underserved areas.'
      },
      {
        term: 'Social Innovation',
        definition: 'New strategies, concepts, and ideas that meet social needs and create social value.',
        example: 'Developing mobile banking solutions to provide financial services to unbanked populations.'
      }
    ]
  }
};

export function SustainabilityGuide({ isVisible, onClose, theme }: SustainabilityGuideProps) {
  const [activeSection, setActiveSection] = useState('basics');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isVisible) return null;

  const currentSection = GUIDE_SECTIONS[activeSection as keyof typeof GUIDE_SECTIONS];
  const Icon = currentSection.icon;

  // Filter content based on search
  const filteredContent = currentSection.content.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-50 dark:bg-slate-700 border-r border-gray-200 dark:border-slate-600">
          <div className="p-6 border-b border-gray-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-green-600" />
                Sustainability Guide
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          {/* Navigation */}
          <div className="p-4">
            <nav className="space-y-2">
              {Object.entries(GUIDE_SECTIONS).map(([key, section]) => {
                const SectionIcon = section.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === key
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <SectionIcon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-2">
                <Icon className={`w-6 h-6 mr-3 text-${currentSection.color}-600`} />
                {currentSection.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? `${filteredContent.length} results found` : `${currentSection.content.length} key concepts`}
              </p>
            </div>

            <div className="space-y-6">
              {filteredContent.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {item.term}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {item.definition}
                  </p>
                  <div className="bg-white dark:bg-slate-600 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong className="text-green-700 dark:text-green-400">Example:</strong> {item.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredContent.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try searching for different terms or browse the categories.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}