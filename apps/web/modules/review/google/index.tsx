'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  GoogleMapRequest,
  GoogleMapResponse,
  GooglePlace,
  GooglePlaceReview,
} from '@reviewsup/api/google';
import { api } from '@/lib/api-client';
import { StarRating } from '@reviewsup/embed-react';
import { ReviewItemSource } from '@reviewsup/embed-react';
import { ReviewsupAvatar } from '@reviewsup/ui/reviewsup-avatar';
import toast from 'react-hot-toast';
import { useSession } from '@/context/UserProvider';

export function ReviewImportGoogleMapDialog(props: {
  productId: string;
  formId: string | undefined;
  onImportStart?: () => void;
  onImportSuccess?: () => void;
  onImportFailed?: (error: Error) => void;
}) {
  const {
    productId,
    formId,
    onImportStart,
    onImportSuccess,
    onImportFailed,
  } = props;
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [textQuery, setTextQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [googleMapResponse, setGoogleMapResponse] = useState<
    GoogleMapResponse | undefined
  >(undefined);
  const [currentPlace, setCurrentPlace] = useState<GooglePlace | null>(null);

  const submitReview = async () => {
    try {
      if (!productId || !currentPlace || !currentPlace.reviews) {
        throw new Error('No google map found');
      }
      if (onImportStart) {
        onImportStart();
      }
      const results = await Promise.all(
        currentPlace.reviews.map((review) => {
          return api.review.createReview(
            {
              productId: productId,
              formId: formId,
              rating: review.rating,
              message: review.text?.text,
              fullName: review.authorAttribution?.displayName,
              email: undefined,
              avatarUrl: review.authorAttribution?.photoUri,
              userUrl: review.authorAttribution?.uri,
              imageUrls: [],
              videoUrl: undefined,
              source: 'google',
              sourceUrl: review.googleMapsUri || currentPlace.googleMapsUri,
              title: '',
              extra: {
                ...review,
              },
            },
            user,
          );
        }),
      );
      if (results && results.length > 0) {
        setIsOpen(false);
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        throw new Error('No reviews found to import');
      }
    } catch (error) {
      if (onImportFailed) {
        onImportFailed(error as Error);
      }
    }
  };

  const renderPlaces = () => {
    if (
      !googleMapResponse ||
      !googleMapResponse.places ||
      googleMapResponse.places.length === 0
    ) {
      return null;
    }
    if (currentPlace) {
      return null;
    }
    return (
      <div className="w-full flex flex-col">
        <h2 className="text-lg font-semibold my-4">Search Results</h2>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto ">
          {googleMapResponse.places.map((place) => (
            <div
              key={place.id}
              className="text-sm text-gray-600 hover:bg-gray-100 cursor-pointer py-2"
              onClick={() => {
                if (!place.reviews || place.reviews.length === 0) {
                  toast.error('No reviews found for this place.');
                  return;
                }
                setCurrentPlace(place);
                setOpen(true);
              }}
            >
              <p>
                {place.displayName?.text} - {place.formattedAddress}
              </p>
              <div className="flex flex-row items-center gap-2 mt-2">
                <StarRating value={place.rating || 0} size={'sm'} />
                <p>{place.rating}</p>
                <p>({place.userRatingCount} reviews)</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    if (
      !currentPlace ||
      !currentPlace.reviews ||
      currentPlace.reviews.length === 0
    ) {
      return null;
    }

    const formatSecondsToDate = (seconds: string | undefined) => {
      if (!seconds) {
        return 'Unknown Date';
      }
      const _seconds = parseInt(seconds, 10);
      const date = new Date(_seconds * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return (
      <div>
        <h2 className="text-lg font-semibold my-4">Place Reviews</h2>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {currentPlace.reviews.map((review) => (
            <div
              key={review.name}
              className="text-sm text-gray-600 p-4 gap-2 flex flex-col border border-gray-200 rounded-md shadow mb-2"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <ReviewsupAvatar
                    uri={review.authorAttribution?.photoUri || ''}
                    name={review.authorAttribution?.displayName || 'Unknown'}
                  />
                  <p className="font-semibold">
                    {review.authorAttribution?.displayName}
                  </p>
                </div>
                <ReviewItemSource source={'google'} />
              </div>
              <StarRating
                value={review.rating || 0}
                size={'sm'}
                onChange={() => {}}
              />
              <p>{review.text?.text}</p>
              <p>{formatSecondsToDate(review.publishTime?.seconds)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  // const debouncedQuery = useDebounce(textQuery, 1000); // 1 秒防抖
  const doSearch = async () => {
    if (!textQuery) {
      return;
    }
    setLoading(true);
    api.review
      .parseGoogleMap({
        textQuery: textQuery,
      } as GoogleMapRequest)
      .then((response: GoogleMapResponse) => {
        setLoading(false);
        setGoogleMapResponse(response);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching Google Map data:', error);
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTextQuery('');
          setGoogleMapResponse(undefined);
          setCurrentPlace(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={'lg'}
          className="w-full items-center justify-center text-sm"
          variant={'outline'}
        >
          <ReviewItemSource clickable={false} source={'google'} />
          Google
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:min-w-2xl overflow-x-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Import from Google Map</DialogTitle>
          <DialogDescription>
            {/*Anyone who has this link will be able to view this.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-4xl font-sans flex flex-col w-full items-center">
          <div className="mb-6 w-full text-start">
            <label
              htmlFor="google map"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Search Name in Google Maps
            </label>
            <div className="flex flex-row items-center gap-2 mb-2">
              <Input
                id="textquery"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                placeholder="Enter a name or address to search in Google Maps"
                className="w-full max-w-4xl"
              />
              <Button
                size={'lg'}
                variant="default"
                disabled={loading}
                onClick={() => {
                  doSearch();
                }}
              >
                {loading ? 'Searching' : 'Search'}
              </Button>
            </div>
            {renderPlaces()}
            {renderReviews()}
          </div>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button size={'lg'} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            size={'lg'}
            type="submit"
            onClick={submitReview}
            disabled={!currentPlace}
            className="ml-2"
          >
            Import All {currentPlace?.reviews?.length} Reviews
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
