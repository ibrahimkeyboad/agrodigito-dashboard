export interface ReportData {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalSales: number;
  lowStockItems: number;
  expiringSoon: number;
}

export interface SalesTrendData {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity: number) => string;
    strokeWidth: number;
  }[];
  legend?: string[];
}

export interface TopProduct {
  name: string;
  revenue: number;
  profit: number;
  quantity: number;
}

export interface StockMovement {
  id: number;
  product: string;
  type: string;
  quantity: number;
  date: string;
  newStock: number;
  notes: string;
  unitPrice: number;
  totalValue: number;
}

export interface LowStockAlert {
  product: string;
  currentStock: number;
  reorderLevel: number;
  status: 'critical' | 'low';
  size: string;
}

export type PeriodType = 'today' | 'week' | 'month' | 'year';
