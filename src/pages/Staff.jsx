import { motion } from 'framer-motion';

const Staff = () => {
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
                        Our Team
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full transform translate-y-2"></span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4">
                        Meet the dedicated educators and leaders committed to nurturing the future of our students.
                    </p>
                </motion.div>

                {/* Headmaster Section */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-blue-50/30"
                    >
                        <div className="md:w-1/2 relative bg-primary/5">
                            <img
                                src="/head master.jpg"
                                alt="Headmaster"
                                className="w-full h-[400px] object-cover object-top transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                        <div className="p-8 md:w-1/2 flex flex-col justify-center">
                            <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark font-semibold rounded-full text-sm mb-4 w-fit">
                                School Leadership
                            </div>
                            <h2 className="text-3xl font-bold text-primary mb-2">Headmaster</h2>
                            <h3 className="text-xl text-slate-700 font-medium mb-4">EP INTWALI</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                "Our mission is to provide a safe, inclusive, and challenging learning environment where every child is valued and encouraged to reach their full potential."
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Staff Group Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl font-bold text-center text-primary mb-10">Our Dedicated Staff</h2>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group transition-all duration-300 hover:shadow-[0_0_30px_rgba(26,79,139,0.3)]">
                        <img
                            src="/staff.jpg"
                            alt="EP INTWALI Staff"
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                            <p className="text-white text-xl font-medium tracking-wide">United in Excellence</p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Staff;
