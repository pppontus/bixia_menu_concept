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

function App() {
    const [menus, setMenus] = React.useState(null);
    const [selectedTab, setSelectedTab] = React.useState('menu1');
    const [selectedCategory, setSelectedCategory] = React.useState('private');

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

    if (!menus) {
        return <div className="text-center mt-8 text-xl text-gray-600">Loading...</div>;
    }

    const currentMenu = menus[selectedTab];

    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-gray-800 text-white">
                <div className="container mx-auto px-4">
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
            <div className="flex-grow bg-gray-100">
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <h1 className="text-3xl font-bold text-custom-blue mb-6">{currentMenu.title}</h1>
                    <div className="mb-6 space-x-4">
                        <button 
                            onClick={() => setSelectedCategory('private')}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue ${
                                selectedCategory === 'private' 
                                    ? 'bg-custom-blue text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Privat
                        </button>
                        <button 
                            onClick={() => setSelectedCategory('corporate')}
                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue ${
                                selectedCategory === 'corporate' 
                                    ? 'bg-custom-blue text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
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
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));