// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card } from 'react-bootstrap';
import CardTitle from './CardTitle';

const PerformanceChart = ({ chartData = [] }): React$Element<any> => {
    const categories = chartData?.map(item => {
        const dateParts = item?.date?.split('-'); // ['yyyy', 'mm', 'dd']
        return `${dateParts[2]}-${dateParts[1]}`;  // 'dd-mm'
    });
    const stockInSeries = chartData?.map(item => item?.totalStockInQty);
    const stockOutSeries = chartData?.map(item => item?.totalStockOutQty);

    const apexBarChartOpts = {
        chart: {
            height: 230,
            type: 'bar',
            stacked: false,
            parentHeightOffset: 0,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        legend: { show: true },
        colors: ['#727cf5', '#fa5c7c'],
        xaxis: {
            categories,
            axisBorder: { show: false },
        },
        yaxis: {
            labels: {
                formatter: val => val,
            },
        },
        fill: { opacity: 1 },
        tooltip: {
            y: {
                formatter: val => `${val}`,
            },
        },
    };

    const apexBarChartData = [
        {
            name: 'Stock In',
            data: stockInSeries,
        },
        {
            name: 'Stock Out',
            data: stockOutSeries,
        },
    ];

    return (
        <Card className="mb-0" style={{ boxShadow: 'none' }}>
            <Card.Body className="p-0">
                <CardTitle
                    containerClass="d-flex align-items-center justify-content-between fs-6"
                    title="Stock In VS Dispatch"
                    menuItems={[
                        { label: 'Sales Report' },
                        { label: 'Export Report' },
                        { label: 'Profit' },
                        { label: 'Action' },
                    ]}
                />
                <div dir="ltr">
                    <Chart
                        options={apexBarChartOpts}
                        series={apexBarChartData}
                        type="bar"
                        className="apex-charts"
                        height={220}
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default PerformanceChart;
