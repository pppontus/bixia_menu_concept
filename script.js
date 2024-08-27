function MenuItem({ item }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="mb-2">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-4 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-custom-blue rounded-md shadow-sm transition duration-150 ease-in-out flex items-center justify-between"
            >
                <span className="font-medium text-gray-900">{item.name}</span>
                {item.children && (
                    <span className="text-custom-blue">
                        <i className={`fas ${isOpen ? 'fa-chevron-down' : 'fa-chevron-right'} transition-transform duration-200`}></i>
                    </span>
                )}
            </button>
            {isOpen && item.children && (
                <div className="ml-4 mt-2">
                    {item.children.map((child, index) => (
                        <MenuItem key={index} item={child} />
                    ))}
                </div>
            )}
        </div>
    );
}

function Footer({ links, isCorporateTheme }) {
    return (
        <div className={`py-6 ${isCorporateTheme ? 'bg-gray-700' : 'bg-gray-100'} transition-all duration-500 ease-in-out`}>
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col space-y-2">
                        {links.map((link, index) => (
                            <a key={index} href="#" className="text-gray-700 hover:underline">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [menus, setMenus] = React.useState(null);
    const [selectedTab, setSelectedTab] = React.useState('menu1');
    const [selectedCategory, setSelectedCategory] = React.useState('private');
    const [isCorporateTheme, setIsCorporateTheme] = React.useState(false);

    React.useEffect(() => {
        // Load all menu data upfront
        Promise.all([
            fetch('menu1-data.json').then(res => res.json()),
            fetch('menu2-data.json').then(res => res.json()),
            fetch('menu3-data.json').then(res => res.json())
        ]).then(([menu1, menu2, menu3]) => {
            setMenus({ menu1, menu2, menu3 });
        }).catch(error => console.error('Error loading menu data:', error));
    }, []);

    React.useEffect(() => {
        // Switch the theme when the category changes
        if (selectedCategory === 'corporate') {
            setIsCorporateTheme(true);
        } else {
            setIsCorporateTheme(false);
        }
    }, [selectedCategory]);

    if (!menus) {
        return <div className="text-center mt-8 text-xl text-gray-600">Loading...</div>;
    }

    const currentMenu = menus[selectedTab];

    return (
        <div className={`min-h-screen flex flex-col ${isCorporateTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} transition-colors duration-500 ease-in-out`}>
            <div className="bg-gray-800 text-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex justify-start space-x-1">
                        {Object.entries(menus).map(([key, menu]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedTab(key)}
                                className={`px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-200 ${
                                    selectedTab === key
                                        ? 'bg-custom-blue'
                                        : 'hover:bg-gray-700'
                                }`}
                            >
                                {menu.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-grow">
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <div className="mb-6 space-x-4">
                        <button 
                            onClick={() => setSelectedCategory('private')}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue transition-colors duration-200 ${
                                selectedCategory === 'private' 
                                    ? 'bg-custom-blue text-white' 
                                    : `bg-${isCorporateTheme ? 'gray-600' : 'white'} text-${isCorporateTheme ? 'gray-300' : 'gray-700'} hover:bg-${isCorporateTheme ? 'gray-500' : 'gray-50'}`
                            }`}
                        >
                            Privat
                        </button>
                        <button 
                            onClick={() => setSelectedCategory('corporate')}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue transition-colors duration-200 ${
                                selectedCategory === 'corporate' 
                                    ? 'bg-custom-blue text-white' 
                                    : `bg-${isCorporateTheme ? 'gray-600' : 'white'} text-${isCorporateTheme ? 'gray-300' : 'gray-700'} hover:bg-${isCorporateTheme ? 'gray-500' : 'gray-50'}`
                            }`}
                        >
                            Företag
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {currentMenu.categories[selectedCategory].map((item, index) => (
                            <MenuItem key={index} item={item} />
                        ))}
                    </div>
                    {/* Headline and Content Section */}
                    <div className="mt-8">
                        <h1 className="text-3xl font-bold mb-4">Rubrik</h1>
                        <p className="text-lg">Här kommer hemsideinnehållet att vara.</p>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <Footer links={currentMenu.footerLinks} isCorporateTheme={isCorporateTheme} />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
