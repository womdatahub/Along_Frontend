export const Updates = () => {
  const updates = [
    { title: "Update Alert", img: "/update1.png" },
    { title: "Update Alert", img: "/update2.png" },
    { title: "Update Alert", img: "/update3.png" },
  ];

  return (
    <section className='py-16 px-6 bg-gray-50'>
      <h2 className='text-2xl font-bold mb-8 text-center'>On the Horizon</h2>
      <div className='grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
        {updates.map((u, i) => (
          <div
            key={i}
            className='rounded-lg overflow-hidden shadow hover:shadow-lg transition'
          >
            <img
              src={u.img}
              alt={u.title}
              className='w-full h-48 object-cover'
            />
            <div className='p-4'>
              <h3 className='font-semibold'>{u.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
