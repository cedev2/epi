import { motion } from 'framer-motion';

const About = () => {
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
                        About Us
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full transform translate-y-2"></span>
                    </h1>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl font-bold text-primary mb-4">Welcome to EP INTWALI</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Ecole Primary Intwali (EP INTWALI) is a premier primary school located in Nyarugenge District. We provide a supportive and stimulating environment where every child can flourish academically and socially.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-200">
                            <div className="text-center">
                                <span className="block text-3xl font-extrabold text-primary mb-1">52+</span>
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Years Experience</span>
                            </div>
                            <div className="text-center border-x border-slate-200">
                                <span className="block text-3xl font-extrabold text-primary mb-1">800+</span>
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Students</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-3xl font-extrabold text-primary mb-1">95%</span>
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Passing Rate of PLE</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                                Contact Us
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(26,79,139,0.3)] hover:scale-[1.02] group">
                            <img
                                src="/ground.jpg"
                                alt="About EP INTWALI"
                                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                            {/* Hover Overlay active state for "lighting" feel */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                    </motion.div>
                </div>

                {/* Values and Taboos Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* INDANGAGACIRO - Values */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-primary transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                    >
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight font-['Outfit']"> INDANGAGACIRO</h2>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "GUKUNDA IGIHUGU",
                                    "UBUNYANGAMUGAYO",
                                    "UBUTWARI",
                                    "UBWITANGE",
                                    "GUKUNDA UMURIMO NO KUWUNOZA",
                                    "KUGIRA ISUKU",
                                    "KUBAHIRIZA IGIHE",
                                    "GUKORERA HAMWE"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 group">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0 group-hover:scale-150 transition-transform"></span>
                                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* KIRAZIRA - Taboos */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-red-500 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                    >
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-50 rounded-lg text-red-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight font-['Outfit']"> KIRAZIRA</h2>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "KUGAMBANIRA IGIHUGU",
                                    "KUGIRA INGENGAIBTEKEREZO YA JENOSIDE",
                                    "KUBA IKIGWARI",
                                    "KUNYWA IBIYOBYABWENGE",
                                    "GUKORERA KU IJISHO",
                                    "KWANGIZA IBIDUKIKIJE",
                                    "KWIYANDARIKA",
                                    "GUHEMUKA",
                                    "KWANGIZA IBYAGEZWEHO"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 group">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 group-hover:scale-150 transition-transform"></span>
                                        <span className="text-slate-700 font-medium group-hover:text-red-600 transition-colors uppercase">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default About;
