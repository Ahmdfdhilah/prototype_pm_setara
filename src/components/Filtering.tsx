import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InfoIcon, CalendarIcon, ClockIcon, BarChart2Icon } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export interface FilteringParams {
    startDate: string;
    endDate: string;
    handleStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isEndDateDisabled: boolean;
    handlePeriodChange: (value: string) => void;
    selectedPeriod: string;
    handleTypeChange: (value: string) => void;
    selectedType: string;
}

function FilterSection({
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    isEndDateDisabled,
    handlePeriodChange,
    selectedPeriod,
    handleTypeChange,
    selectedType
}: FilteringParams) {
    return (
        <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
                <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
                    Filter Options
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="w-full space-y-6">
                    <Alert className="bg-[#E4EFCF]/30 dark:bg-[#E4EFCF]/10 border-[#46B749] dark:border-[#1B6131]">
                        <InfoIcon className="h-5 w-5 text-[#46B749] dark:text-[#1B6131]" />
                        <AlertTitle className="text-[#46B749] dark:text-[#1B6131] font-semibold">
                            Filter Instructions
                        </AlertTitle>
                        <AlertDescription className="text-gray-700 dark:text-gray-300">
                            Select a date range or period to display matching data. When selecting a period, the date range will be disabled.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div className="space-y-3">
                            <label htmlFor="startDate" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                <CalendarIcon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                <span>Start Date</span>
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                className="w-full bg-white dark:bg-gray-800 border border-[#46B749] dark:border-[#1B6131] p-2 h-10 rounded-md focus:ring-2 focus:ring-[#46B749] dark:focus:ring-[#1B6131] focus:outline-none text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="endDate" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                <CalendarIcon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                <span>End Date</span>
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                disabled={isEndDateDisabled}
                                className="w-full bg-white dark:bg-gray-800 border border-[#46B749] dark:border-[#1B6131] p-2 h-10 rounded-md focus:ring-2 focus:ring-[#46B749] dark:focus:ring-[#1B6131] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                <ClockIcon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                <span>Period</span>
                            </label>
                            <Select onValueChange={handlePeriodChange} value={selectedPeriod}>
                                <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                    <SelectValue placeholder="Select Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Jan-25">Jan 2025</SelectItem>
                                    <SelectItem value="Feb-25">Feb 2025</SelectItem>
                                    <SelectItem value="Mar-25">Mar 2025</SelectItem>
                                    <SelectItem value="Apr-25">Apr 2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                <BarChart2Icon className="h-4 w-4 text-[#46B749] dark:text-[#1B6131]" />
                                <span>Data Type</span>
                            </label>
                            <Select onValueChange={handleTypeChange} value={selectedType}>
                                <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-[#46B749] dark:border-[#1B6131] h-10">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default FilterSection;