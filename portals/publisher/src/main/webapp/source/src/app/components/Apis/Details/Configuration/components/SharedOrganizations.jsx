/*eslint-disable*/
/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { FormattedMessage, useIntl } from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HelpOutline from '@mui/icons-material/HelpOutline';
import API from 'AppData/api';
import { useAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import { isRestricted } from 'AppData/AuthManager';

const PREFIX = 'SharedOrganizations';

const classes = {
    tooltip: `${PREFIX}-tooltip`,
    listItemText: `${PREFIX}-listItemText`
};

const StyledBox = styled(Box)(({ theme }) => ({
    [`& .${classes.tooltip}`]: {
        position: 'absolute',
        right: theme.spacing(-4),
        top: theme.spacing(1),
    },

    [`& .${classes.listItemText}`]: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}));

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

/**
 * Render the organizations drop down.
 * @param {JSON} props props passed from it's parents.
 * @returns {JSX} Render the organizations drop down.
 */
function SharedOrganizations(props) {
    const [organizations, setOrganizations] = useState({
        count: 2,
        list: [
            {
                organizationId: "ece92bdc-e1e6-325c-b6f4-656208a041e9",
                externalOrganizationId: "external-org-1",
                parentOrganizationId: "ece92bdc-e1e6-325c-b6f4-656208a041e1",
                displayName: "Mock Organization 1",
                description: "This is a mock organization 1",
            },
            {
                organizationId: "b123fca4-9dcd-432d-88e2-456708bca90e",
                externalOrganizationId: "external-org-2",
                parentOrganizationId: "ece92bdc-e1e6-325c-b6f4-656208a041e1",
                displayName: "Mock Organization 2",
                description: "This is a mock organization 2",
            },
        ],
    });
    const { api, configDispatcher } = props;

    const [apiFromContext] = useAPI();
    const intl = useIntl();

    useEffect(() => {
        // currently using mock data for organizations
        // API.sharedOrganizations().then((response) => setOrganizations(response.body));
    }, []);

    if (organizations && !organizations.list) {
        return null;
    } else if (organizations && organizations.list) {
        return (
            <StyledBox style={{ position: 'relative', marginTop: 10 }}>
                <Autocomplete
                    disabled={isRestricted(['apim:api_create', 'apim:api_publish'], apiFromContext)
                        || organizations.list.length === 0
                    }
                    multiple
                    fullWidth
                    limitTags={5}
                    id='SharedOrganizations-autocomplete'
                    options={organizations.list} // Pass the full organization object
                    getOptionLabel={(option) => option.displayName} // Show displayName in dropdown
                    noOptionsText='No Organizations selected'
                    disableCloseOnSelect
                    value={organizations.list.filter(org => api.visibleOrganizations.includes(org.organizationId))} // Map organizationId to objects
                    onChange={(e, newValue) => {
                        const selectedOrgIds = newValue.map(org => org.organizationId); // Extract only organizationId
                        configDispatcher({ action: 'visibleOrganizations', value: selectedOrgIds });
                    }}
                    renderOption={(props, organization, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                id={organization.organizationId}
                                key={organization.organizationId}
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {organization.displayName} {/* Display Name */}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params}
                            disabled={isRestricted(['apim:api_create', 'apim:api_publish'], apiFromContext)
                                || organizations.list.length === 0
                            }
                            fullWidth
                            label={organizations.list.length !== 0 ? (
                                <FormattedMessage
                                    id='Apis.Details.Configurations.shared.organizations'
                                    defaultMessage='Shared Organizations'
                                />
                            ) : (
                                <FormattedMessage
                                    id='Apis.Details.Configurations.shared.organizations.empty'
                                    defaultMessage='No organizations selected.'
                                />
                            )}
                            placeholder={intl.formatMessage({
                                id:'Apis.Details.Configurations.shared.organizations.placeholder.text',
                                defaultMessage:'Search Organizations'
                            })}
                            helperText={(
                                <FormattedMessage
                                    id='Apis.Details.Configurations.shared.organizations.helper.text'
                                    defaultMessage='Select organizations for sharing the API'
                                />
                            )}
                            margin='normal'
                            variant='outlined'
                            id='SharedOrganizations'
                        />
                    )}
                />
                <Tooltip
                    title={(
                        <>
                            <p>
                                <FormattedMessage
                                    id='Shared.organizations.dropdown.tooltip'
                                    defaultMessage={'Allow to share API with other organizations.'
                                        + ' There has to be pre-defined organizations in the'
                                        + ' environment in order to share the API.'}
                                />
                            </p>
                        </>
                    )}
                    aria-label='Shared Organizations'
                    placement='right-end'
                    interactive
                    className={classes.tooltip}
                >
                    <HelpOutline />
                </Tooltip>
            </StyledBox>
        );
    }
}

SharedOrganizations.defaultProps = {
    organizations: [],
    api: PropTypes.shape({}).isRequired,
    configDispatcher: PropTypes.func.isRequired,
};

export default SharedOrganizations;
