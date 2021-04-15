import React from "react";

export default function Contact() {


  return (
    <div>
      {/* Logo */}
      <div>
        <img src="" alt="" />
        <h1>Musicademy</h1>
      </div>

      {/* Main */}
      <div>
        {/* Left Side */}
        <div>
          <img src="" alt="" />
          <ul>
            <li>musicademy@gmail.com</li>
            <li>760.208.0335</li>
            <li>San Diego, CA</li>
            <br />
            <li>Social Media 1</li>
            <li>Social Media 2</li>
          </ul>
        </div>

        {/* Right Side */}
        <div>
          <h2>Send us a message</h2>
          <p>
            Tempor commodo aliquip anim laboris laborum. Deserunt occaecat
            officia sit reprehenderit dolore ea id adipisicing ex qui officia ut
            occaecat do.{" "}
          </p>
          <div>
            <form id="contactForm">
              <div>
                <label>Full Name</label>
                <input
                  id="contact-fullName"
                  type="text"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label>Email</label>
                <input id="contact-email" type="text" placeholder="Email" />
              </div>
              <div>
                <label>Subject</label>
                <input id="contact-subject" type="text" placeholder="Subject" />
              </div>
              <div>
                <label>Message</label>
                <textarea
                  id="contact-message"
                  name="tbMessage"
                  rows="10"
                  placeholder="Message"
                ></textarea>
              </div>
              <div>
                <button>Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
