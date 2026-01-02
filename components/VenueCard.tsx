'use client';

import { Venue } from '@/lib/types';
import { dayDisplayNames, dayColors } from '@/lib/constants';
import { getVerificationStatus } from '@/lib/utils';
import {
  MapPin,
  Phone,
  Globe,
  Star,
  Facebook,
  Instagram,
  ExternalLink,
} from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  areaDisplayName: string;
}

export default function VenueCard({ venue, areaDisplayName }: VenueCardProps) {
  const verificationStatus = getVerificationStatus(venue.verifiedDate);

  const getIconForExtraDetail = (iconName?: string) => {
    switch (iconName) {
      case 'star':
        return Star;
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      default:
        return ExternalLink;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-200">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-gray-900">{venue.name}</h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <MapPin className="w-3 h-3 mr-1" />
              {areaDisplayName}
            </span>
            {venue.days.map((day) => (
              <span
                key={day}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${dayColors[day]}`}
              >
                {dayDisplayNames[day]}
              </span>
            ))}
            {venue.membershipRequired && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Membership Required
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">{venue.details}</p>

        {venue.membershipRequired && venue.membershipDetails && (
          <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
            {venue.membershipDetails}
          </p>
        )}

        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>Verified:</span>
            <span className={verificationStatus.color}>
              {new Date(venue.verifiedDate).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="text-gray-400">{venue.address}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-100">
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Globe className="w-4 h-4 mr-2" />
            Website
          </a>
          {venue.phone.map((phoneNumber, index) => (
            <a
              key={index}
              href={`tel:${phoneNumber}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Phone className="w-4 h-4 mr-2" />
              {phoneNumber}
            </a>
          ))}
        </div>

        {venue.extraDetails && venue.extraDetails.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {venue.extraDetails.map((detail, index) => {
              const IconComponent = getIconForExtraDetail(detail.icon);
              return (
                <a
                  key={index}
                  href={detail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-200 shadow-sm text-xs font-medium rounded-md text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <IconComponent className="w-3.5 h-3.5 mr-1.5" />
                  {detail.label}
                </a>
              );
            })}
          </div>
        )}

        {venue.tags && venue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {venue.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500 bg-gray-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
