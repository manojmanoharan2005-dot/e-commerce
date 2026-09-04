export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-200 rounded-md w-1/3" />
      <div className="h-4 bg-slate-200 rounded-md w-3/4" />
      <div className="h-4 bg-slate-200 rounded-md w-1/2" />
      <div className="pt-2 flex justify-between items-center">
        <div className="h-6 bg-slate-200 rounded-md w-1/3" />
        <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
      </div>
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
    <div className="aspect-square bg-slate-200 rounded-2xl" />
    <div className="space-y-4">
      <div className="h-4 bg-slate-200 rounded-md w-1/4" />
      <div className="h-8 bg-slate-200 rounded-md w-3/4" />
      <div className="h-6 bg-slate-200 rounded-md w-1/3" />
      <div className="h-20 bg-slate-200 rounded-xl w-full" />
      <div className="h-12 bg-slate-200 rounded-xl w-full" />
    </div>
  </div>
);

export const CartItemSkeleton = () => (
  <div className="p-4 border border-slate-200 rounded-2xl flex gap-4 animate-pulse">
    <div className="w-24 h-24 bg-slate-200 rounded-xl shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-slate-200 rounded-md w-1/2" />
      <div className="h-4 bg-slate-200 rounded-md w-1/4" />
      <div className="h-8 bg-slate-200 rounded-lg w-28" />
    </div>
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="card p-6 space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded-md w-1/4" />
      <div className="h-6 bg-slate-200 rounded-full w-24" />
    </div>
    <div className="h-16 bg-slate-200 rounded-xl" />
    <div className="h-4 bg-slate-200 rounded-md w-1/3" />
  </div>
);
