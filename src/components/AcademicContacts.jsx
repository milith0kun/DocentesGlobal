'use client';

import { useState } from 'react';

const contacts = [
  {
    institution: 'CIIP Latam',
    role: 'Coordinacion academica',
    phone: '+51 956 006 498',
    wa: '51956006498',
  },
  {
    institution: 'Geomina',
    role: 'Coordinacion academica',
    phone: '+51 925 084 564',
    wa: '51925084564',
  },
  {
    institution: 'Biomedic',
    role: 'Coordinacion academica',
    phone: '+51 956 006 498',
    wa: '51956006498',
  },
  {
    institution: 'Direccion academica',
    role: 'Ger. del Dep. academico',
    phone: '+51 956 370 155',
    wa: '51956370155',
  },
  {
    institution: 'Soporte',
    role: 'Soporte académico',
    phone: '+51 913 484 877',
    wa: '51913484877',
  },
];

export default function AcademicContacts({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={className} aria-label="Contacto institucional">
      <div className="container">
        <div className="contactDisclosure">
          <button
            className="contactSummaryAction"
            type="button"
            aria-expanded={isOpen}
            aria-controls="office-contact-panel"
            onClick={() => setIsOpen((current) => !current)}
          >
            Contactos oficina
          </button>

          {isOpen && (
          <div className="contactsPanel" id="office-contact-panel">
            <p className="contactsHint">
              Selecciona tu institucion para escribir por WhatsApp.
            </p>

            <div className="contactsGrid">
              {contacts.map((contact) => (
                <div key={`${contact.institution}-${contact.wa}`} className="contactItem">
                  <div>
                    <span className="contactInstitution">{contact.institution}</span>
                    <strong>{contact.role}</strong>
                    <span className="contactPhone">{contact.phone}</span>
                  </div>
                  <a
                    className="contactWhatsApp"
                    href={`https://wa.me/${contact.wa}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp directo
                  </a>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </aside>
  );
}
