import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const News = () => {
    const [selectedId, setSelectedId] = useState(null);

    const newsItems = [
        {
            id: 1,
            title: "KUNG-FU WUSHU FEDERATION",
            date: "1st December 2023",
            image: "/kung-fu.jpg",
            category: "Sports & Events",
            description: "Today 1st December 2023, Rwanda Kung-fu wushu Federation launched IMBARUTSO PROJECT/KUNGFU IN SCHOOLS at Intwali Primary School in Rwezamenyo Sector, Nyarugenge District. Kungfu is being to be practiced in schools among other sports in Primary and secondary schools as well as in Universities. Let's build the Future with Better health through Kungfu wushu Sport.",
            fullStory: [
                "Kung Fu is an ancient Chinese martial art that has been practiced for centuries. It is not only a method of self-defense, but also a way to improve physical health, mental focus, and personal discipline. Kung Fu training includes a wide range of movements such as punches, kicks, blocks, stances, and flowing forms that develop strength, flexibility, balance, and coordination.",
                "Beyond physical techniques, Kung Fu teaches important life values like respect, patience, perseverance, and self-control. Practitioners learn to stay calm under pressure, build confidence, and maintain harmony between the body and the mind. Whether practiced for fitness, self-defense, or personal growth, Kung Fu offers a complete path to a healthier, stronger, and more disciplined lifestyle."
            ],
            extraImages: ["/kung.jpg"]
        },
        {
            id: 2,
            title: "Ecole Primaire Intwari: Bibutse abarimu n’abanyeshuri bishwe muri Jenoside, bamagana ivangura ryakorwaga mu mashuri",
            date: "31st January 2026",
            image: "/jen 1.png",
            category: "Events",
            description: "Ihuriro ry’abarimu n’abanyeshuri bize ku Ishuri Ribanza ry’Intwari (Ecole Primaire Intwari), rifatanyije n’Umuryango w’Abayislamu mu Rwanda (RMC), ubuyobozi bw’inzego z’ibanze, ababyeyi n’abaturage, bibutse abazize Jenoside yakorewe Abatutsi mu 1994, by’umwihariko abahoze ari abarimu n’abanyeshuri b’icyo kigo.",
            fullStory: [
                "Abayobozi batandukanye barimo abayobozi b’Umurenge, Umuyobozi w’ishuri, Umuyobozi w’Umuryango w’Abayislamu mu Rwanda (Mufti), n’abadepite, bashimangiye akamaro ko kwibuka, guharanira ubumwe n’ubudaheranwa, no kurwanya abahakana Jenoside. Hibutswe abarimu 12 n’abanyeshuri 89 bahoze biga cyangwa bigisha kuri iryo shuri.",
                "Iki gikorwa cyashimangiye uruhare rw’uburezi mu kubaka u Rwanda rushingiye ku ndangagaciro zirimo urukundo, ubumwe, ubutwari n’ubunyangamugayo, ndetse hanatangazwa igitekerezo cyo kubaka urwibutso rwihariye rw’abarimu n’abanyeshuri b’ishuri ry’Intwari bazize Jenoside yakorewe Abatutsi."
            ],
            extraImages: ["/jen 2.png", "/jen3.png"]
        }
    ];

    const selectedItem = newsItems.find(item => item.id === selectedId);

    return (
        <div className="pt-32 pb-16 min-h-screen bg-gray-50 font-['Outfit']">
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 relative inline-block">
                        News & Updates
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full transform translate-y-2"></span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4">
                        Stay informed about the latest events, achievements, and activities at EP INTWALI.
                    </p>
                </motion.div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {newsItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 flex flex-col h-full group"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                    {item.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-sm text-slate-500 mb-3 space-x-2">
                                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{item.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 mb-4 flex-1 line-clamp-4 leading-relaxed">
                                    {item.description}
                                </p>
                                <button
                                    onClick={() => setSelectedId(item.id)}
                                    className="text-primary font-semibold text-sm hover:text-primary-dark transition-colors inline-flex items-center gap-1 group/btn mt-auto"
                                >
                                    Read Full Story
                                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Load More Button (Visual Only) */}
                <div className="text-center">
                    <button className="px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg">
                        Load More Posts
                    </button>
                </div>

                {/* Modal for Full Story */}
                <AnimatePresence>
                    {selectedId && selectedItem && (
                        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="relative h-64 md:h-80 shrink-0">
                                    <img
                                        src={selectedItem.image}
                                        alt={selectedItem.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <div className="absolute bottom-6 left-8 right-8">
                                        <div className="inline-block px-3 py-1 bg-accent text-primary-dark font-bold text-xs rounded-full uppercase mb-3">
                                            {selectedItem.category}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                            {selectedItem.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Modal Content - Scrollable */}
                                <div className="p-8 overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center text-sm text-slate-500 mb-6 bg-slate-50 w-fit px-4 py-2 rounded-full border border-slate-100">
                                        <svg className="w-4 h-4 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">{selectedItem.date}</span>
                                    </div>

                                    <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                                        <p className="font-semibold text-primary/90 italic border-l-4 border-accent pl-4">
                                            {selectedItem.description}
                                        </p>

                                        {selectedItem.fullStory && selectedItem.fullStory.map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))}

                                        {selectedItem.extraImages && selectedItem.extraImages.map((img, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="my-8 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Extra content ${idx + 1}`}
                                                    className="w-full h-auto"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center shrink-0">
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all shadow-md"
                                    >
                                        Back to News
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default News;
