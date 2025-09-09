export const Footer = () => {
  return (
    <footer className='bg-teal-700 text-white py-10 px-6'>
      <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-8'>
        <div>
          <h2 className='text-xl font-bold'>along</h2>
          <div className='flex gap-3 mt-4'>
            <button className='bg-black px-4 py-2 rounded'>Android</button>
            <button className='bg-black px-4 py-2 rounded'>Apple</button>
          </div>
        </div>
        <div>
          <h3 className='font-semibold mb-3'>Quick Links</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#'>About</a>
            </li>
            <li>
              <a href='#'>Ride</a>
            </li>
            <li>
              <a href='#'>Drive</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold mb-3'>Get in Touch</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#'>About</a>
            </li>
            <li>
              <a href='#'>Ride</a>
            </li>
            <li>
              <a href='#'>Drive</a>
            </li>
          </ul>
        </div>
      </div>
      <div className='text-center text-sm mt-8 opacity-75'>
        ©2025 Along Inc. All Rights Reserved | <a href='#'>Privacy Policy</a> |{" "}
        <a href='#'>Terms</a>
      </div>
    </footer>
  );
};
