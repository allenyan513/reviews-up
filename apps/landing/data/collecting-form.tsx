
export const collectingFormData: {
  title: string;
  subtitle: React.ReactNode;
  formId: string;
  buttonText: string;
} = {
  title: 'Collecting Reviews via Form',
  subtitle: (
    <span>
      Leave a review using the form below -- it will be published and rewarded
      with a <span className="font-semibold text-red-500">backlink</span>.
    </span>
  ),
  formId:
    process.env.NODE_ENV === 'development' ? '329b3b9f3ee' : 'f09dbd1ff08',

  buttonText: 'Leave a Review -- it\'s quick and easy 😁',
};
