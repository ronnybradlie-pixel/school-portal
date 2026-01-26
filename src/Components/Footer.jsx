export default function Footer() {
  return (
    <footer className="bg-white text-black-300 py-8 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
            {/* School Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">School Portal</h3>
            <p className="text-sm text-black-400">
              Your child's dream is well secured with us.
            </p>
          </div>

          {/* Motto */}
          <div>
            <h4 className="text-white font-semibold mb-2">Motto</h4>
            <p className="text-sm text-black-400 italic">
              "Excellence in Education, Character in Action"
            </p>
          </div>

           {/* Vision & Contact  */}
         <div>
            <h4 className="text-white font-semibold mb-2">Vision & Contact</h4>
            <p className="text-sm text-black-400 mb-2">
              <strong>Vision:</strong> To be a leading institution in quality education.
            </p>
            <p className="text-sm text-black-400">
              <strong>Contact:</strong> <br />
              Email: Dreamintlsch@gmail.com <br />
              Phone: +254 712 345 678
            </p>
          </div>
        </div>

        <hr className="border-slate-700 my-6" />

        <div className="text-center text-sm text-gray-500">
          <p>&copy; 2026 School Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
