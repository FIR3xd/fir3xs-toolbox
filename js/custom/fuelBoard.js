document.addEventListener("DOMContentLoaded", () => {
    // Load Google Charts
    google.charts.load('current', { packages: ['table'] });
    google.charts.setOnLoadCallback(drawTables);

    // Config: Sheet ID + GIDs
    const SHEET_ID = '1OTLd5_nN05Ix_NIsfY_oNVg7ny7rb2wyvBPOKMbjquA';
    const TAB1_GID = '1299819905';
    const TAB2_GID = '1136819972';

    function drawTables() {
        loadSheetData(TAB1_GID, 'table1_div');
        loadSheetData(TAB2_GID, 'table2_div');
    }

    function loadSheetData(gid, elementId) {
        const query = new google.visualization.Query(
            `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${gid}&headers=1`
        );

        query.send(response => {
            if (response.isError()) {
                console.error(`Error loading data for ${elementId}:`, response.getMessage());
                return;
            }

            const data = response.getDataTable();

            // Loop through each cell and preserve Google Sheets background colors
            for (let row = 0; row < data.getNumberOfRows(); row++) {
                for (let col = 0; col < data.getNumberOfColumns(); col++) {
                    const style = data.getProperty(row, col, 'style');
                    if (style) {
                        data.setProperty(row, col, 'style', style);
                    }
                }
            }

            const table = new google.visualization.Table(document.getElementById(elementId));

            table.draw(data, {
                allowHtml: true, // Required for custom styles
                showRowNumber: false,
                width: '100%',
                height: 'auto'
            });
        });
    }
});
