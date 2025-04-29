function TestimonialBadge() {
    return (
      <div className="flex items-center rounded-full bg-background px-3 w-50 h-10 shadow-[3px_3px_0px_black] border-black border">
        <div className="flex -space-x-1">
          <img
            className="rounded-full ring-1 ring-background"
            src="https://originui.com/avatar-80-03.jpg"
            width={15}
            height={15}
            alt="Avatar 01"
          />
          <img
            className="rounded-full ring-1 ring-background"
            src="https://originui.com/avatar-80-04.jpg"
            width={15}
            height={15}
            alt="Avatar 02"
          />
          <img
            className="rounded-full ring-1 ring-background"
            src="https://originui.com/avatar-80-05.jpg"
            width={15}
            height={15}
            alt="Avatar 03"
          />
          <img
            className="rounded-full ring-1 ring-background"
            src="https://originui.com/avatar-80-06.jpg"
            width={15}
            height={15}
            alt="Avatar 04"
          />
        </div>
        <p className="px-1 text-xs text-muted-foreground">
          Trusted by <strong className="font-medium text-foreground">60K+</strong> developers.
        </p>
      </div>
    );
  }
  
  export default TestimonialBadge;